// Handle dragging for all windows
var backup = document.body.innerHTML;

document.querySelectorAll('.window').forEach((win) => {
  const titlebar = win.querySelector('.titlebar');
  let isDragging = false;
  let offsetX, offsetY;

  titlebar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = 1000; // bring to front
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
});

// Handle Add Skill buttons
document.querySelectorAll('.window').forEach((win) => {
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
function updateClock() {
  const now = new Date();
  const hrs = now.getHours().toString().padStart(2, '0');
  const mins = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('clock').textContent = `${hrs}:${mins}`;
}
setInterval(updateClock, 1000);
updateClock();
function restoreOS() {
  document.body.innerHTML = backup;
  document.body.style.backgroundColor = 'black';

  // Re-run Clippy setup
  const clippy = document.getElementById('clippy');
  const clippyTalk = document.getElementById('clippy-talk');
  clippy.addEventListener('click', clippySpeak);
  setInterval(clippySpeak, 10000);

  // 🛠️ Reattach drag and minimize to all windows
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
    document.getElementById('web-os').style.display = 'block';
    document.getElementById('loading-bar').style.display = 'none';
  }, 3250);
  
}

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
function makeDraggable(win) {
  const titlebar = win.querySelector('.titlebar');
  let isDragging = false;
  let offsetX, offsetY;

  titlebar.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = 1000;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}
function attachMinimizeButton(win) {
  const button = win.querySelector('.minimize-btn');
  if (button) {
    button.addEventListener('click', () => {
      const content = win.querySelector('.window-content');
      content.style.display =
        content.style.display === 'none' ? 'block' : 'none';
    });
  }
}
document.querySelectorAll('.window').forEach((win) => {
  attachMinimizeButton(win);
});
const clippy = document.getElementById('clippy');
const clippyTalk = document.getElementById('clippy-talk');

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
  const message =
    clippyMessages[Math.floor(Math.random() * clippyMessages.length)];
  clippyTalk.innerHTML = message;
  clippyTalk.style.display = 'block';

  setTimeout(() => {
    clippyTalk.style.display = 'none';
  }, 3000); // hide after 3 seconds
}

// Talk every 10 seconds
setInterval(clippySpeak, 10000);

// Optional: Talk when clicked
clippy.addEventListener('click', clippySpeak);

function newWindow() {
  var win = document.createElement('div');
  win.className = 'window';
  const top = Math.floor(Math.random() * (window.innerHeight - 200)); // avoid off-screen
  const left = Math.floor(Math.random() * (window.innerWidth - 300)); // avoid off-screen

  win.style.top = `${top}px`;
  win.style.left = `${left}px`;

  win.innerHTML = `    <div class="titlebar">notes<button class="close" onclick="this.closest('div.window').remove()">X</button><button class="minimize-btn">_</button></div>
    <div class="window-content">
        <textarea name="" id="" style="width: 100%; height: 140px; margin-top: 15px;"></textarea>
    </div>`;
  document.body.appendChild(win);
  makeDraggable(win);
  attachMinimizeButton(win);
  backup = document.body.innerHTML;
}
setTimeout(() => {
  document.getElementById('login').style.display = 'block';
  document.getElementById('loading-bar').style.display = 'none';
}, 3250);
document.getElementById("login2").addEventListener('click', () => {
  document.getElementById('login').style.display = 'none';
  document.getElementById('web-os').style.display = 'block';
  document.getElementById('username2').innerText = `${document.getElementById('username').value}@pc-workstation`
})
var hidemenu = () => {
  if (document.getElementById('startmenu').style.display == 'none') {
    document.getElementById('startmenu').style.display = 'block';
  } else {
    document.getElementById('startmenu').style.display = 'none';
  }
};

