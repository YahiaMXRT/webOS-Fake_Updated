// Handle dragging for all windows
var backup = document.body.innerHTML;

// Make windows draggable
function makeDraggable(win) {
  const titlebar = win.querySelector('.titlebar');
  let isDragging = false;
  let offsetX, offsetY;

  titlebar.addEventListener('pointerdown', (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.setPointerCapture(e.pointerId);
    win.style.zIndex = 1000;
    localStorage.setItem('osBackup', document.body.innerHTML);
  });
  
  titlebar.addEventListener('pointermove', (e) => {
    if (isDragging) {
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    }
  });
  
  titlebar.addEventListener('pointerup', (e) => {
    isDragging = false;
    win.releasePointerCapture(e.pointerId);
  });

  // Touch support
  titlebar.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.clientX - win.offsetLeft;
    offsetY = touch.clientY - win.offsetTop;
    win.style.zIndex = 1000;
  });

  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      win.style.left = `${touch.clientX - offsetX}px`;
      win.style.top = `${touch.clientY - offsetY}px`;
    }
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// Attach minimize functionality
function attachMinimizeButton(win) {
  const button = win.querySelector('.minimize-btn');
  if (button) {
    button.addEventListener('click', () => {
      const content = win.querySelector('.window-content');
      if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
      }
    });
  }
}

// Initialize existing windows
document.querySelectorAll('.window').forEach((win) => {
  makeDraggable(win);
  attachMinimizeButton(win);

  // Handle Add Skill buttons
  const addBtn = win.querySelector('.addSkillBtn');
  const input = win.querySelector('.skillInput');
  const skillsContainer = win.querySelector('.skills');

  if (addBtn && input && skillsContainer) {
    addBtn.addEventListener('click', () => {
      const value = input.value.trim();
      if (value !== '') {
        const newSkill = document.createElement('div');
        newSkill.className = 'skill';
        newSkill.textContent = `Good At ${value}`;
        skillsContainer.appendChild(newSkill);
        input.value = '';
      }
    });
  }
});

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
setInterval(updateClock, 1000);
updateClock();

// Restore OS functionality
function restoreOS() {
  document.body.innerHTML = backup;
  document.body.style.backgroundColor = 'black';

  // Re-run Clippy setup
  const clippy = document.getElementById('clippy');
  const clippyTalk = document.getElementById('clippy-talk');
  if (clippy && clippyTalk) {
    clippy.addEventListener('click', clippySpeak);
    setInterval(clippySpeak, 10000);
  }

  // Reattach functionality to all windows
  document.querySelectorAll('.window').forEach((win) => {
    makeDraggable(win);
    attachMinimizeButton(win);

    // Reattach skill logic if skill section exists
    const addBtn = win.querySelector('.addSkillBtn');
    const input = win.querySelector('.skillInput');
    const skillsContainer = win.querySelector('.skills');

    if (addBtn && input && skillsContainer) {
      addBtn.addEventListener('click', () => {
        const value = input.value.trim();
        if (value !== '') {
          const newSkill = document.createElement('div');
          newSkill.className = 'skill';
          newSkill.textContent = `Good At ${value}`;
          skillsContainer.appendChild(newSkill);
          input.value = '';
        }
      });
    }
  });

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
  document.body.style.color = 'black';
}

// Create new window with specific type
function newWindow3(type = "notes") {
  const win = document.createElement('div');
  win.className = 'window';
  const top = Math.floor(Math.random() * (window.innerHeight - 200));
  const left = Math.floor(Math.random() * (window.innerWidth - 300));
  win.style.top = `${top}px`;
  win.style.left = `${left}px`;

  let content = '';
  if (type === 'notes') {
    content = `
      <div class="titlebar">Notes
        <button class="close" onclick="this.closest('div.window').remove()">X</button>
        <button class="minimize-btn">_</button>
      </div>
      <div class="window-content">
        <textarea style="width: 100%; height: 140px; margin-top: 15px;"></textarea>
      </div>`;
  } else if (type === 'terminal') {
    content = `
      <div class="titlebar">Terminal
        <button class="close" onclick="this.closest('div.window').remove()">X</button>
        <button class="minimize-btn">_</button>
      </div>
      <div class="window-content">
        <iframe src="shell.html" frameborder="0" style="width: 100%; height: 150px;"></iframe>
      </div>`;
  } else if (type === 'minecraft') {
    content = `
      <div class="titlebar">MC Client
        <button class="close" onclick="this.closest('div.window').remove()">X</button>
        <button class="minimize-btn">_</button>
      </div>
      <div class="window-content">
        <p>Launching Minecraft Hack Client UI... (Coming soon!)</p>
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
  const top = Math.floor(Math.random() * (window.innerHeight - 200));
  const left = Math.floor(Math.random() * (window.innerWidth - 300));
  win.style.top = `${top}px`;
  win.style.left = `${left}px`;

  if (args === 'normal') {
    win.innerHTML = `
      <div class="titlebar">MC Client
        <button class="close" onclick="this.closest('div.window').remove()">X</button>
        <button class="minimize-btn">_</button>
      </div>
      <div class="window-content">
        <p>Launching Minecraft Hack Client UI... (Coming soon!)</p>
      </div>`;
  } else if (args === 'custom') {
    win.innerHTML = `
      <div class="titlebar">${titlebar}
        <button class="close" onclick="this.closest('div.window').remove()">X</button>
        <button class="minimize-btn">_</button>
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
  'Yahia is the best web dev i know',
  `<a href="https://discord.com/channels/@me">Discord</a>`,
];

function clippySpeak() {
  const clippyTalk = document.getElementById('clippy-talk');
  if (clippyTalk) {
    const message = clippyMessages[Math.floor(Math.random() * clippyMessages.length)];
    clippyTalk.innerHTML = message;
    clippyTalk.style.display = 'block';

    setTimeout(() => {
      clippyTalk.style.display = 'none';
    }, 3000);
  }
}

// Initialize Clippy when page loads
document.addEventListener('DOMContentLoaded', () => {
  const clippy = document.getElementById('clippy');
  if (clippy) {
    clippy.addEventListener('click', clippySpeak);
    setInterval(clippySpeak, 10000);
  }
});

// Login functionality
setTimeout(() => {
  const loginElement = document.getElementById('login');
  const loadingBar = document.getElementById('loading-bar');
  if (loginElement) loginElement.style.display = 'block';
  if (loadingBar) loadingBar.style.display = 'none';
}, 3250);

// Login button event listener
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById("login2");
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const loginElement = document.getElementById('login');
      const webOS = document.getElementById('web-os');
      const usernameElement = document.getElementById('username');
      const username2Element = document.getElementById('username2');
      const terminalIframe = document.querySelector("#term-outline iframe");

      if (loginElement) loginElement.style.display = 'none';
      if (webOS) webOS.style.display = 'block';
      
      if (usernameElement && username2Element) {
        const username = usernameElement.value;
        username2Element.innerText = `${username}@pc-workstation`;
        localStorage.setItem('username', username);
      }

      if (terminalIframe) {
        terminalIframe.contentWindow.location.reload();
      }

      // Special user handling
      const storedUser = localStorage.getItem('user');
      if (storedUser === 'omarsaly') {
        newWindow2('custom', `<h1>Weeeeeeelome Omar!!!!</h1><p>You are a special guy</p>`, 'Welcome Omar');
      }
    });
  }
});

// Start menu toggle
function hidemenu() {
  const startMenu = document.getElementById('startmenu');
  if (startMenu) {
    startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
  }
}

// Window resizing functionality
document.addEventListener('DOMContentLoaded', () => {
  const resizer = document.querySelector('.resizer');
  const windowEl = document.getElementById('login');

  if (resizer && windowEl) {
    resizer.addEventListener('mousedown', function(e) {
      e.preventDefault();
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
      windowEl.style.width = (e.clientX - windowEl.offsetLeft) + 'px';
      windowEl.style.height = (e.clientY - windowEl.offsetTop) + 'px';
    }

    function stopResize() {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResize);
    }
  }
});