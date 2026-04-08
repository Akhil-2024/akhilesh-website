// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

// Close mobile menu after click
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    if (navMenu) {
      navMenu.classList.remove("show");
    }
  });
});

// FAQ
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(question => {
  question.addEventListener("click", () => {
    const answer = question.nextElementSibling;
    const isOpen = answer.style.display === "block";

    document.querySelectorAll(".faq-answer").forEach(item => {
      item.style.display = "none";
    });

    if (!isOpen) {
      answer.style.display = "block";
    }
  });
});

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;

  reveals.forEach(item => {
    const top = item.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      item.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// ================= AUTO YOUTUBE VIDEOS =================
const API_KEY = "AIzaSyAu9hB1jUxB7cKR1lZMCZOJRMrpCm9kqqM";
const CHANNEL_ID = "UCs0ebMMgEzQehxUWAKSCJHQ";
const videosContainer = document.getElementById("youtubeVideos");

async function loadLatestVideos() {
  if (!videosContainer) return;

  try {
    // 1. Get uploads playlist ID
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    const channelData = await channelRes.json();

    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      videosContainer.innerHTML = "<div class='loading-box'>Could not load channel videos.</div>";
      return;
    }

    // 2. Get latest uploaded videos
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=6&key=${API_KEY}`
    );
    const playlistData = await playlistRes.json();

    const items = playlistData.items || [];

    if (!items.length) {
      videosContainer.innerHTML = "<div class='loading-box'>No videos found.</div>";
      return;
    }

    videosContainer.innerHTML = items
      .map((item) => {
        const title = item.snippet.title;
        const videoId = item.snippet.resourceId?.videoId;
        const thumb =
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url;

        if (!videoId) return "";

        return `
          <div class="auto-video-card">
            <img class="auto-video-thumb" src="${thumb}" alt="${title}">
            <div class="auto-video-content">
              <h3>${title}</h3>
              <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">Watch Video →</a>
            </div>
          </div>
        `;
      })
      .join("");

    // Re-run reveal after videos load
    revealOnScroll();
  } catch (error) {
    console.error("YouTube API Error:", error);
    videosContainer.innerHTML = "<div class='loading-box'>Failed to load latest videos.</div>";
  }
}

window.addEventListener("load", loadLatestVideos);