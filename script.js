// Handle dragging for all windows
let backup = document.body.innerHTML;

// Make windows draggable
function makeDraggable(win) {
  const titlebar = win.querySelector('.titlebar');
  if (!titlebar) return;
  
  let isDragging = false;
  let offsetX, offsetY;

  // Remove existing listeners to prevent duplicates
  titlebar.removeEventListener('pointerdown', handlePointerDown);
  titlebar.removeEventListener('touchstart', handleTouchStart);

  function handlePointerDown(e) {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.setPointerCapture(e.pointerId);
    win.style.zIndex = 1000;
    localStorage.setItem('osBackup', document.body.innerHTML);
  }

  function handlePointerMove(e) {
    if (isDragging) {
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    }
  }

  function handlePointerUp(e) {
    isDragging = false;
    win.releasePointerCapture(e.pointerId);
  }

  function handleTouchStart(e) {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - win.offsetLeft;
    offsetY = touch.clientY - win.offsetTop;
    win.style.zIndex = 1000;
  }

  function handleTouchMove(e) {
    if (isDragging) {
      const touch = e.touches[0];
      win.style.left = `${touch.clientX - offsetX}px`;
      win.style.top = `${touch.clientY - offsetY}px`;
    }
  }

  function handleTouchEnd() {
    isDragging = false;
  }

  titlebar.addEventListener('pointerdown', handlePointerDown);
  titlebar.addEventListener('pointermove', handlePointerMove);
  titlebar.addEventListener('pointerup', handlePointerUp);
  titlebar.addEventListener('touchstart', handleTouchStart);
  document.addEventListener('touchmove', handleTouchMove);
  document.addEventListener('touchend', handleTouchEnd);
}

// Attach minimize functionality
function attachMinimizeButton(win) {
  const button = win.querySelector('.minimize-btn');
  if (button) {
    // Remove existing listener to prevent duplicates
    button.removeEventListener('click', handleMinimize);
    
    function handleMinimize() {
      const content = win.querySelector('.window-content');
      if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
      }
    }
    
    button.addEventListener('click', handleMinimize);
  }
}

// Attach skill functionality
function attachSkillFunctionality(win) {
  const addBtn = win.querySelector('.addSkillBtn');
  const input = win.querySelector('.skillInput');
  const skillsContainer = win.querySelector('.skills');

  if (addBtn && input && skillsContainer) {
    // Remove existing listener to prevent duplicates
    addBtn.removeEventListener('click', handleAddSkill);
    
    function handleAddSkill() {
      const value = input.value.trim();
      if (value !== '') {
        const newSkill = document.createElement('div');
        newSkill.className = 'skill';
        newSkill.textContent = `Good At ${value}`;
        skillsContainer.appendChild(newSkill);
        input.value = '';
      }
    }
    
    addBtn.addEventListener('click', handleAddSkill);
    
    // Add enter key support
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleAddSkill();
      }
    });
  }
}

// Initialize existing windows
function initializeWindows() {
  document.querySelectorAll('.window').forEach((win) => {
    makeDraggable(win);
    attachMinimizeButton(win);
    attachSkillFunctionality(win);
  });
}

// Clock functionality
function updateClock() {
  const now = new Date();
  const hrs = now.getHours().toString().padStart(2, '0');
  const mins = now.getMinutes().toString().padStart(2, '0');
  const clockElement = document.getElementById('clock');
  if (clockElement) {
    clockElement.textContent = `${hrs}:${mins}`;
  }
}

// Start clock
let clockInterval;
function startClock() {
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(updateClock, 1000);
  updateClock();
}

// Restore OS functionality
function restoreOS() {
  document.body.innerHTML = backup;
  document.body.style.backgroundColor = 'black';

  // Re-initialize everything
  initializeWindows();
  startClock();
  initializeClippy();

  setTimeout(() => {
    const webOS = document.getElementById('web-os');
    const loadingBar = document.getElementById('loading-bar');
    if (webOS) webOS.style.display = 'block';
    if (loadingBar) loadingBar.style.display = 'none';
  }, 3250);
}

// Kill OS functionality
function killOS() {
  document.body.innerHTML = `
    <div class="awSnap">
      <div class="sadTab"></div>
      <h1>Aw, Snap!</h1>
      <p>Something went wrong while displaying this webpage.</p>
      <button onclick="restoreOS()">Restore OS</button>  
    </div>
  `;
  document.body.style.background = 'blue';
  document.body.style.color = 'white';
}

// Create new window with specific type
function newWindow3(type = "notes") {
  const win = document.createElement('div');
  win.className = 'window';
  
  // Better positioning to avoid overlap
  const existingWindows = document.querySelectorAll('.window').length;
  const offset = existingWindows * 30;
  const top = Math.max(50, Math.min(window.innerHeight - 300, 100 + offset));
  const left = Math.max(50, Math.min(window.innerWidth - 350, 100 + offset));
  
  win.style.top = `${top}px`;
  win.style.left = `${left}px`;

  let content = '';
  if (type === 'notes') {
    content = `
      <div class="titlebar">Notes
        <button class="close" onclick="this.closest('div.window').remove()">×</button>
        <button class="minimize-btn">−</button>
      </div>
      <div class="window-content">
        <textarea style="width: 100%; height: 140px; margin-top: 15px; resize: vertical;" placeholder="Start typing your notes..."></textarea>
      </div>`;
  } else if (type === 'terminal') {
    content = `
      <div class="titlebar">Terminal
        <button class="close" onclick="this.closest('div.window').remove()">×</button>
        <button class="minimize-btn">−</button>
      </div>
      <div class="window-content">
        <iframe src="shell.html" frameborder="0" style="width: 100%; height: 150px; border: none;"></iframe>
      </div>`;
  } else if (type === 'minecraft') {
    content = `
      <div class="titlebar">MC Client
        <button class="close" onclick="this.closest('div.window').remove()">×</button>
        <button class="minimize-btn">−</button>
      </div>
      <div class="window-content">
        <div style="text-align: center; padding: 20px;">
          <h3>Minecraft Client</h3>
          <p>Launching Minecraft Hack Client UI...</p>
          <div style="margin: 10px 0;">
            <div style="background: #333; height: 10px; border-radius: 5px; overflow: hidden;">
              <div style="background: #4CAF50; height: 100%; width: 75%; animation: pulse 2s infinite;"></div>
            </div>
          </div>
          <p style="color: #888; font-size: 12px;">Status: Loading modules...</p>
        </div>
      </div>`;
  }

  win.innerHTML = content;
  document.body.appendChild(win);
  makeDraggable(win);
  attachMinimizeButton(win);
  backup = document.body.innerHTML;
}

// Create new notes window (legacy function)
function newWindow() {
  newWindow3('notes');
}

// Create custom window
function newWindow2(args = 'normal', custom = '', titlebar = 'Window') {
  const win = document.createElement('div');
  win.className = 'window';
  
  const existingWindows = document.querySelectorAll('.window').length;
  const offset = existingWindows * 30;
  const top = Math.max(50, Math.min(window.innerHeight - 300, 100 + offset));
  const left = Math.max(50, Math.min(window.innerWidth - 350, 100 + offset));
  
  win.style.top = `${top}px`;
  win.style.left = `${left}px`;

  if (args === 'normal') {
    win.innerHTML = `
      <div class="titlebar">MC Client
        <button class="close" onclick="this.closest('div.window').remove()">×</button>
        <button class="minimize-btn">−</button>
      </div>
      <div class="window-content">
        <div style="text-align: center; padding: 20px;">
          <h3>Minecraft Client</h3>
          <p>Launching Minecraft Hack Client UI...</p>
          <p style="color: #888; font-size: 12px;">Coming soon!</p>
        </div>
      </div>`;
  } else if (args === 'custom') {
    win.innerHTML = `
      <div class="titlebar">${titlebar}
        <button class="close" onclick="this.closest('div.window').remove()">×</button>
        <button class="minimize-btn">−</button>
      </div>
      <div class="window-content">
        ${custom}
      </div>`;
  }

  document.body.appendChild(win);
  makeDraggable(win);
  attachMinimizeButton(win);
  backup = document.body.innerHTML;
}

// Clippy functionality
const clippyMessages = [
  'Hi there! Need help?',
  "It looks like you're building a web OS!",
  "Don't forget to save your work!",
  'I used to be in Office...',
  'Press Start to begin your journey!',
  "You're doing great :)",
  "Need a break? I'm always here!",
  'Yahia is the best web dev I know',
  `<a href="https://discord.com/channels/@me" target="_blank">Discord</a>`,
];

let clippyInterval;

function clippySpeak() {
  const clippyTalk = document.getElementById('clippy-talk');
  if (clippyTalk) {
    const message = clippyMessages[Math.floor(Math.random() * clippyMessages.length)];
    clippyTalk.innerHTML = message;
    clippyTalk.style.display = 'block';

    setTimeout(() => {
      if (clippyTalk) {
        clippyTalk.style.display = 'none';
      }
    }, 3000);
  }
}

function initializeClippy() {
  const clippy = document.getElementById('clippy');
  if (clippy) {
    // Remove existing listeners
    clippy.removeEventListener('click', clippySpeak);
    clippy.addEventListener('click', clippySpeak);
    clippy.style.pointerEvents = 'auto';
    clippy.style.cursor = 'pointer';
    
    // Clear existing interval
    if (clippyInterval) clearInterval(clippyInterval);
    clippyInterval = setInterval(clippySpeak, 10000);
  }
}

// Start menu toggle
function hidemenu() {
  const startMenu = document.getElementById('startmenu');
  if (startMenu) {
    startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
  }
}

// Login functionality
function initializeLogin() {
  setTimeout(() => {
    const loginElement = document.getElementById('login');
    const loadingBar = document.getElementById('loading-bar');
    if (loginElement) loginElement.style.display = 'block';
    if (loadingBar) loadingBar.style.display = 'none';
  }, 3250);

  const loginBtn = document.getElementById("login2");
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
  }
}

function handleLogin() {
  const loginElement = document.getElementById('login');
  const webOS = document.getElementById('web-os');
  const usernameElement = document.getElementById('username');
  const username2Element = document.getElementById('username2');
  const terminalIframe = document.querySelector("#term-outline iframe");

  if (loginElement) loginElement.style.display = 'none';
  if (webOS) webOS.style.display = 'block';
  
  if (usernameElement && username2Element) {
    const username = usernameElement.value || 'guest';
    username2Element.innerText = `${username}@pc-workstation`;
    localStorage.setItem('username', username);
  }

  if (terminalIframe) {
    terminalIframe.contentWindow.location.reload();
  }

  // Special user handling
  const storedUser = localStorage.getItem('username');
  if (storedUser === 'omarsaly') {
    newWindow2('custom', `<h1>Welcome Omar!!!!</h1><p>You are a special guy</p>`, 'Welcome Omar');
  }
}

// Window resizing functionality
function initializeResizer() {
  const resizer = document.querySelector('.resizer');
  const windowEl = document.getElementById('login');

  if (resizer && windowEl) {
    resizer.addEventListener('mousedown', function(e) {
      e.preventDefault();
      
      function resize(e) {
        const newWidth = Math.max(200, e.clientX - windowEl.offsetLeft);
        const newHeight = Math.max(150, e.clientY - windowEl.offsetTop);
        windowEl.style.width = newWidth + 'px';
        windowEl.style.height = newHeight + 'px';
      }

      function stopResize() {
        window.removeEventListener('mousemove', resize);
        window.removeEventListener('mouseup', stopResize);
      }

      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize);
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeWindows();
  startClock();
  initializeClippy();
  initializeLogin();
  initializeResizer();
  
  // Store initial backup
  backup = document.body.innerHTML;
});

// Handle username input enter key
document.addEventListener('DOMContentLoaded', function() {
  const usernameInput = document.getElementById('username');
  if (usernameInput) {
    usernameInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleLogin();
      }
    });
  }
});