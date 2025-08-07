document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle logic
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  const root = document.documentElement;
  function setTheme(dark) {
    if (dark) {
      document.body.classList.add('dark-theme');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      themeToggleBtn.setAttribute('aria-label', 'Toggle light mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      themeToggleBtn.setAttribute('aria-label', 'Toggle dark mode');
      localStorage.setItem('theme', 'light');
    }
  }
  // Initial theme
  const userPref = localStorage.getItem('theme');
  if (userPref === 'dark' || (!userPref && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    setTheme(true);
  } else {
    setTheme(false);
  }
  themeToggleBtn.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark-theme'));
  });

  // Contact modal logic
  const contactBtn = document.getElementById('contact-btn');
  const contactModal = document.getElementById('contact-modal');
  const closeContactModal = document.getElementById('close-contact-modal');
  const contactDetails = document.getElementById('contact-details');
  let contactInfo = null;

  contactBtn.addEventListener('click', () => {
    if (contactInfo) renderContactDetails(contactInfo);
    contactModal.classList.remove('hidden');
  });
  closeContactModal.addEventListener('click', () => {
    contactModal.classList.add('hidden');
  });
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) contactModal.classList.add('hidden');
  });

  function renderContactDetails(info) {
    contactDetails.innerHTML = '';
    if (info.email) {
      const email = document.createElement('div');
      email.innerHTML = `<i class="fas fa-envelope"></i> <a href="mailto:${info.email}">${info.email}</a>`;
      contactDetails.appendChild(email);
    }
    if (info.phone) {
      const phone = document.createElement('div');
      phone.innerHTML = `<i class="fas fa-phone"></i> <a href="tel:${info.phone}">${info.phone}</a>`;
      contactDetails.appendChild(phone);
    }
    if (info.location) {
      const loc = document.createElement('div');
      loc.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${info.location}`;
      contactDetails.appendChild(loc);
    }
    // Always show socials if present
    if (Array.isArray(info.socials) && info.socials.length > 0) {
      const socialsLabel = document.createElement('div');
      socialsLabel.textContent = 'Socials:';
      socialsLabel.style.margin = '18px 0 6px 0';
      socialsLabel.style.fontWeight = '600';
      contactDetails.appendChild(socialsLabel);
      const socials = document.createElement('div');
      socials.className = 'social-links contact-socials';
      info.socials.forEach(social => {
        const a = document.createElement('a');
        a.href = social.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.title = social.name;
        const icon = document.createElement('i');
        icon.className = social.icon;
        a.appendChild(icon);
        socials.appendChild(a);
      });
      contactDetails.appendChild(socials);
    }
  }

  async function populateWebsite() {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      contactInfo = data.personalInfo;
      populateAbout(data.personalInfo);
      populateProjects(data.projects);
      populateExperience(data.experience);
      populateSkills(data.skills);
      populateResume();
      setupSectionAnimations();
      setupTabs();
    } catch (error) {
      document.body.innerHTML = '<p style="color:#ff6b6b;text-align:center;">Failed to load portfolio data.</p>';
      console.error('Error loading data.json:', error);
    }
  }

  function populateAbout(info) {
    const about = document.getElementById('about');
    about.innerHTML = '';
    // Add photo if present
    if (info.photo) {
      const img = document.createElement('img');
      img.src = info.photo;
      img.alt = info.name + ' photo';
      img.className = 'about-photo';
      about.appendChild(img);
    }
    const h1 = document.createElement('h1');
    h1.textContent = info.name;
    const title = document.createElement('p');
    title.textContent = info.title;
    title.style.fontWeight = '600';
    const bio = document.createElement('p');
    bio.textContent = info.bio;
    about.appendChild(h1);
    about.appendChild(title);
    about.appendChild(bio);
    if (info.socials && Array.isArray(info.socials)) {
      const socials = document.createElement('div');
      socials.className = 'social-links';
      info.socials.forEach(social => {
        const a = document.createElement('a');
        a.href = social.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.title = social.name;
        const icon = document.createElement('i');
        icon.className = social.icon;
        a.appendChild(icon);
        socials.appendChild(a);
      });
      about.appendChild(socials);
    }
  }

  function populateProjects(projects) {
    const projectsSection = document.getElementById('projects');
    projectsSection.innerHTML = '<h2>Projects</h2>';
    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      // Title
      const title = document.createElement('h3');
      title.textContent = project.title;
      card.appendChild(title);
      // Description
      const desc = document.createElement('p');
      desc.textContent = project.description;
      card.appendChild(desc);
      // Technologies
      if (project.technologies && Array.isArray(project.technologies)) {
        const techList = document.createElement('div');
        techList.className = 'skills-list';
        project.technologies.forEach(tech => {
          const techItem = document.createElement('span');
          techItem.className = 'skill';
          techItem.textContent = tech;
          techList.appendChild(techItem);
        });
        card.appendChild(techList);
      }
      // GitHub Link
      if (project.link) {
        const githubLink = document.createElement('a');
        githubLink.href = project.link;
        githubLink.target = '_blank';
        githubLink.rel = 'noopener noreferrer';
        githubLink.className = 'github-link';
        githubLink.title = 'View on GitHub';
        const icon = document.createElement('i');
        icon.className = 'fab fa-github';
        githubLink.appendChild(icon);
        githubLink.appendChild(document.createTextNode(' GitHub'));
        card.appendChild(githubLink);
      }
      projectsSection.appendChild(card);
    });
  }

  function populateExperience(experiences) {
    const expSection = document.getElementById('experience');
    expSection.innerHTML = '<h2>Experience</h2>';
    experiences.forEach(exp => {
      const div = document.createElement('div');
      div.className = 'experience-item';
      const role = document.createElement('h3');
      role.textContent = exp.role;
      const company = document.createElement('p');
      company.textContent = exp.company + ' | ' + exp.period;
      company.style.fontWeight = '600';
      const desc = document.createElement('p');
      desc.textContent = exp.description;
      div.appendChild(role);
      div.appendChild(company);
      div.appendChild(desc);
      expSection.appendChild(div);
    });
  }

  function populateSkills(skills) {
    const skillsSection = document.getElementById('skills');
    skillsSection.innerHTML = '<h2>Skills</h2>';
    skills.forEach(skillGroup => {
      const groupTitle = document.createElement('h3');
      groupTitle.textContent = skillGroup.name;
      skillsSection.appendChild(groupTitle);
      const list = document.createElement('div');
      list.className = 'skills-list';
      skillGroup.list.forEach(skill => {
        const item = document.createElement('span');
        item.className = 'skill';
        item.textContent = skill;
        list.appendChild(item);
      });
      skillsSection.appendChild(list);
    });
  }

  function populateResume() {
    const resumeSection = document.getElementById('resume');
    resumeSection.innerHTML = '<h2>Resume</h2>';
    const pdfPath = 'Asmit_s_Resume (15).pdf';
    const iframe = document.createElement('iframe');
    iframe.src = pdfPath + '?t=' + new Date().getTime(); // cache-busting for updates
    iframe.width = '100%';
    iframe.height = '700px';
    iframe.style.border = 'none';
    iframe.title = 'Resume PDF';
    resumeSection.appendChild(iframe);
    // Optionally, add a download link
    const download = document.createElement('a');
    download.href = pdfPath;
    download.download = 'Asmit_Mishra_Resume.pdf';
    download.className = 'github-link';
    download.style.marginTop = '18px';
    download.innerHTML = '<i class="fas fa-download"></i> Download PDF';
    resumeSection.appendChild(download);
  }

  // Fade-in-up animation for sections on scroll
  function setupSectionAnimations() {
    const sections = document.querySelectorAll('main > section');
    const observer = new window.IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    sections.forEach(section => observer.observe(section));
  }

  // Tab switching logic
  function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabSections = document.querySelectorAll('.tab-section');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active from all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabSections.forEach(sec => sec.classList.remove('active'));
        // Add active to clicked and corresponding section
        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab');
        const section = document.getElementById(tabId);
        if (section) section.classList.add('active');
      });
    });
  }

  populateWebsite();
}); 