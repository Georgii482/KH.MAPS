console.log("Script N1.js connected successfully!")

document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById("button")
  const menu_bar = document.getElementById("menu_bar")
  const setting = document.getElementById("setting")
  const Setting_up = document.getElementById("Setting_up")
  
  if (!Setting_up) {
    console.warn("Setting_up element not found")
    return
  }
  
  const closeBtn = Setting_up.querySelector(".close-btn")
  const colorSwitchBtn = Setting_up.querySelector(".color-switch-btn")
  const leave = Setting_up.querySelector(".Log-in")

  const Country = document.getElementById("Country")
  const City = document.getElementById("City")
  const Wind = document.getElementById("Wind")
  const Temperature = document.getElementById("Temperature")
  const Weather = document.getElementById("Weather")
  const Sunrise = document.getElementById("Sunrise")
  const Sunset = document.getElementById("Sunset")
  const VideoUpload = document.getElementById("VideoUpload")
  const Logo = document.getElementById("logo")
  const infoElements = [Country, City, Wind, Temperature, Weather, Sunrise, Sunset, VideoUpload].filter(Boolean)

  var key = true

  if (button) {
    button.addEventListener("click", () => {
      if (key == true) {
        if (menu_bar) menu_bar.classList.add("active")
        if (setting) setting.classList.add("active")
        infoElements.forEach((element) => element.classList.add("active"))
        key = false
      } else {
        key = true
        if (menu_bar) menu_bar.classList.remove("active")
        if (setting) setting.classList.remove("active")
        infoElements.forEach((element) => element.classList.remove("active"))
      }
    })
  }

  if (setting) {
    setting.addEventListener("click", () => {
      if (Setting_up) Setting_up.classList.add("active")
      key = true
      if (menu_bar) menu_bar.classList.remove("active")
      if (setting) setting.classList.remove("active")
      infoElements.forEach((element) => element.classList.remove("active"))
    })
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (Setting_up) Setting_up.classList.remove("active")
    })
  }

  if (colorSwitchBtn) {
    colorSwitchBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme")
    })
  }

  if (leave) {
    leave.addEventListener("click", () => {
      window.location.href = "/"
    })
  }
})
function showVideo(src) {
const modal = document.getElementById("videoModal");
const video = document.getElementById("modalVideo");
if (modal && video) {
    video.src = src;
    modal.style.display = "flex";
}
}

function hideVideo() {
const modal = document.getElementById("videoModal");
const video = document.getElementById("modalVideo");
if (modal && video) {
    video.pause();
    modal.style.display = "none";
}
}

function openUploadModal() {
const uploadModal = document.getElementById("uploadModal");
if (uploadModal) {
    uploadModal.style.display = "flex";
}
}

function closeUploadModal() {
const uploadModal = document.getElementById("uploadModal");
if (uploadModal) {
    uploadModal.style.display = "none";
}
}

function addVideoToList(videoName) {
const videoList = document.getElementById("videoList");
if (!videoList) return;

const li = document.createElement("li");
const a = document.createElement("a");
a.href = "#";
a.textContent = videoName;
a.onclick = function() {
    showVideo('/static/uploads/' + videoName);
    return false;
};

li.appendChild(a);

if (videoList.children.length === 1 && 
    videoList.children[0].textContent.trim() === "Немає відео.") {
    videoList.innerHTML = ""; 
}

videoList.appendChild(li);
}

document.addEventListener('DOMContentLoaded', function() {
const openUploadModalBtn = document.getElementById('openUploadModal');
const closeUploadModalBtn = document.getElementById('closeUploadModal');
const uploadForm = document.getElementById('uploadForm');

if (openUploadModalBtn) {
    openUploadModalBtn.addEventListener('click', openUploadModal);
}

if (closeUploadModalBtn) {
    closeUploadModalBtn.addEventListener('click', closeUploadModal);
}

if (uploadForm) {
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const videoFile = formData.get('video');
        
        if (!videoFile || !videoFile.name) {
            alert('Будь ласка, виберіть відео для завантаження.');
            return;
        }
        
        const videoFileName = videoFile.name;
        
        fetch('/DE', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                closeUploadModal();
                
                uploadForm.reset();
                
                addVideoToList(videoFileName);
                
                alert('Відео успішно завантажено!');
                
                return;
            }
            throw new Error('Network response was not ok.');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Помилка при завантаженні відео.');
        });
    });
}
});
function showVideoDynamic(videoName,email) {
  console.log("Отриманий email:", email);
  console.log(email);
  console.log(email);
  console.log(email);
  console.log(email);
  console.log(email);
  if (email) {
    console.log("Отриманий email:", email);
    const fullPath = `/static/uploads/${email}/${videoName}`;
    showVideo(fullPath);
  } else {
    showVideo(`/static/uploads/${email}/${videoName}`);
  }
}
const PrivacyPolicy = document.getElementById("PrivacyPolicy")
if (PrivacyPolicy) {
  PrivacyPolicy.addEventListener("click", (event) => {
    event.preventDefault(); 
    window.alert("404 Not Found");  
  });
}
