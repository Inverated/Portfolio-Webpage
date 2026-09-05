const BASE_URL = import.meta.env.BASE_URL;

const endpoints = {
  navbar: `${BASE_URL}profile/navbar.json`,
  routes: `${BASE_URL}profile/routes.json`,
  home: `${BASE_URL}profile/home.json`,
  social: `${BASE_URL}profile/social.json`,
  about: `${BASE_URL}profile/about.json`,
  skills: `${BASE_URL}profile/skills.json`,
  education: `${BASE_URL}profile/education.json`,
  experiences: `${BASE_URL}profile/experiences.json`,
  projects: `${BASE_URL}profile/projects.json`,
  hobbies: `${BASE_URL}profile/hobbies.json`,
  community: `${BASE_URL}profile/community.json`,
};

export default endpoints;
