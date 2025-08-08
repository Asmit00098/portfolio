document.addEventListener('DOMContentLoaded', () => {
  // State management
  let currentSectionIndex = 0;
  const sections = ['about', 'experience', 'skills', 'resume'];
  const totalSections = sections.length;

  // Theme toggle logic
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  
  function setTheme(isLight) {
    if (isLight) {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
      themeToggleBtn.setAttribute('aria-label', 'Toggle dark mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
      themeToggleBtn.setAttribute('aria-label', 'Toggle light mode');
      localStorage.setItem('theme', 'dark');
    }
  }

  // Initial theme
  const userPref = localStorage.getItem('theme');
  if (userPref === 'light') {
    setTheme(true);
  } else {
    setTheme(false);
  }
  
  themeToggleBtn.addEventListener('click', () => {
    const isCurrentlyLight = document.body.classList.contains('light-theme');
    setTheme(!isCurrentlyLight);
  });

  // Mobile hamburger menu functionality
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileNav() {
    mobileNavToggle.classList.toggle('active');
    mobileNavOverlay.classList.toggle('visible');
    document.body.style.overflow = mobileNavOverlay.classList.contains('visible') ? 'hidden' : '';
  }

  function closeMobileNav() {
    mobileNavToggle.classList.remove('active');
    mobileNavOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  mobileNavToggle.addEventListener('click', toggleMobileNav);
  mobileNavClose.addEventListener('click', closeMobileNav);

  // Close mobile nav when clicking on a link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        closeMobileNav();
      }
    });
  });

  // Close mobile nav when clicking outside
  mobileNavOverlay.addEventListener('click', (e) => {
    if (e.target === mobileNavOverlay) {
      closeMobileNav();
    }
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

  // Core navigation function with staggered animations
  function showSection(index) {
    // Ensure index is within bounds
    if (index < 0) index = totalSections - 1;
    if (index >= totalSections) index = 0;
    
    currentSectionIndex = index;
    
    // Update panels
    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, i) => {
      if (i === index) {
        panel.classList.add('active');
        // Trigger staggered animations for content
        setTimeout(() => {
          const contentBlock = panel.querySelector('.content-block');
          if (contentBlock) {
            contentBlock.style.animation = 'none';
            contentBlock.offsetHeight; // Trigger reflow
            contentBlock.style.animation = 'fadeInUp 0.6s ease-out';
          }
        }, 300);
      } else {
        panel.classList.remove('active');
      }
    });
    
    // Update navigation buttons
    const navButtons = document.querySelectorAll('.nav-link');
    navButtons.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Arrow navigation
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  prevBtn.addEventListener('click', () => {
    showSection(currentSectionIndex - 1);
  });
  
  nextBtn.addEventListener('click', () => {
    showSection(currentSectionIndex + 1);
  });

  // Top navigation
  const navButtons = document.querySelectorAll('.nav-link');
  navButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      showSection(index);
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      showSection(currentSectionIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showSection(currentSectionIndex + 1);
    }
  });

  // Populate content functions with sophisticated styling
  function populateAbout(info) {
    const aboutContent = document.getElementById('about-content');
    aboutContent.innerHTML = '';
    
    // Add photo if present
    if (info.photo) {
      const img = document.createElement('img');
      img.src = info.photo;
      img.alt = info.name + ' photo';
      img.className = 'about-photo';
      aboutContent.appendChild(img);
    }
    
    const h1 = document.createElement('h1');
    h1.textContent = info.name;
    aboutContent.appendChild(h1);
    
    const title = document.createElement('p');
    title.textContent = info.title;
    title.style.fontWeight = '500';
    title.style.color = 'var(--color-accent)';
    title.style.fontSize = '1.125rem';
    aboutContent.appendChild(title);
    
    const bio = document.createElement('p');
    bio.textContent = info.bio;
    bio.style.marginTop = 'var(--space-md)';
    aboutContent.appendChild(bio);
    
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
      aboutContent.appendChild(socials);
    }
  }

  function populateProjects(projects) {
    const projectsScroll = document.getElementById('projects-scroll');
    projectsScroll.innerHTML = '';
    
    projects.forEach((project, index) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.style.animationDelay = `${index * 0.1}s`;
      card.style.animation = 'fadeInUp 0.6s ease-out forwards';
      card.style.opacity = '0';
      
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
      
      projectsScroll.appendChild(card);
    });
  }

  function populateExperience(experiences) {
    const expContent = document.getElementById('experience-content');
    expContent.innerHTML = '<h2 class="section-title">Experience</h2>';
    
    experiences.forEach((exp, index) => {
      const div = document.createElement('div');
      div.className = 'experience-item';
      div.style.animationDelay = `${index * 0.1}s`;
      div.style.animation = 'fadeInUp 0.6s ease-out forwards';
      div.style.opacity = '0';
      
      const role = document.createElement('h3');
      role.textContent = exp.role;
      const company = document.createElement('p');
      company.textContent = exp.company + ' | ' + exp.period;
      const desc = document.createElement('p');
      desc.textContent = exp.description;
      
      div.appendChild(role);
      div.appendChild(company);
      div.appendChild(desc);
      expContent.appendChild(div);
    });
  }

  function populateSkills(skills) {
    const skillsContent = document.getElementById('skills-content');
    skillsContent.innerHTML = '<h2 class="section-title">Skills</h2>';
    
    skills.forEach((skillGroup, groupIndex) => {
      const groupTitle = document.createElement('h3');
      groupTitle.textContent = skillGroup.name;
      groupTitle.style.marginTop = groupIndex > 0 ? 'var(--space-lg)' : '0';
      skillsContent.appendChild(groupTitle);
      
      const list = document.createElement('div');
      list.className = 'skills-list';
      list.style.marginTop = 'var(--space-sm)';
      
      skillGroup.list.forEach((skill, skillIndex) => {
        const item = document.createElement('span');
        item.className = 'skill';
        item.textContent = skill;
        item.style.animationDelay = `${(groupIndex * 0.1) + (skillIndex * 0.05)}s`;
        item.style.animation = 'fadeInUp 0.6s ease-out forwards';
        item.style.opacity = '0';
        list.appendChild(item);
      });
      
      skillsContent.appendChild(list);
    });
  }

  function populateResume() {
    const resumeContent = document.getElementById('resume-content');
    resumeContent.innerHTML = '<h2 class="section-title">Resume</h2>';
    
    const pdfPath = 'Asmit_s_Resume (15).pdf';
    const iframe = document.createElement('iframe');
    iframe.src = pdfPath + '?t=' + new Date().getTime();
    iframe.width = '100%';
    iframe.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.style.backgroundColor = 'var(--color-surface)';
    iframe.title = 'Resume PDF';
    resumeContent.appendChild(iframe);
    
    // Download link
    const download = document.createElement('a');
    download.href = pdfPath;
    download.download = 'Asmit_Mishra_Resume.pdf';
    download.className = 'github-link';
    download.style.marginTop = 'var(--space-md)';
    download.style.display = 'inline-flex';
    download.innerHTML = '<i class="fas fa-download"></i> Download PDF';
    resumeContent.appendChild(download);
  }

  // Main initialization
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
      
      // Initialize with first section
      showSection(0);
    } catch (error) {
      document.body.innerHTML = '<p style="color:var(--color-accent);text-align:center;padding:var(--space-lg);">Failed to load portfolio data.</p>';
      console.error('Error loading data.json:', error);
    }
  }

  populateWebsite();
}); 