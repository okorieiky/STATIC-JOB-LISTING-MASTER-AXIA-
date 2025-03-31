fetch("user.json")
  .then((res) => res.json())
  .then((data) => {
    const jobListings = document.getElementById("job-listings");
    const filterContainer = document.getElementById("filter-container");
    const selectedFiltersContainer =
      document.getElementById("selected-filters");
    const clearFiltersButton = document.getElementById("clear-filters");

    let activeFilters = [];

    function renderJobs(jobs) {
      jobListings.innerHTML = ""; // Clear previous content

      jobs.forEach((job) => {
        const jobCard = document.createElement("div");
        jobCard.classList.add("job-card");
        if (job.featured) jobCard.classList.add("featured"); // Highlight featured jobs

        jobCard.innerHTML = `
          <img src="${job.logo}" alt="${job.company}">
          <div class="job-info">
              <h4>${job.company} ${
          job.new ? '<span class="tag new">NEW!</span>' : ""
        } ${
          job.featured ? '<span class="tag featured">FEATURED</span>' : ""
        }</h4>
              <h3>${job.position}</h3>
              <p>${job.postedAt} • ${job.contract} • ${job.location}</p>
          </div>
          <div class="job-tags">
              <span class="tag" data-filter="${job.role}">${job.role}</span>
              <span class="tag" data-filter="${job.level}">${job.level}</span>
              ${job.languages
                .map(
                  (lang) =>
                    `<span class="tag" data-filter="${lang}">${lang}</span>`
                )
                .join("")}
              ${job.tools
                .map(
                  (tool) =>
                    `<span class="tag" data-filter="${tool}">${tool}</span>`
                )
                .join("")}
          </div>
        `;

        // Add click event listener to each tag
        jobCard.querySelectorAll(".tag").forEach((tag) => {
          tag.addEventListener("click", function () {
            addFilter(tag.dataset.filter);
          });
        });

        jobListings.appendChild(jobCard);
      });
    }

    function addFilter(filter) {
      if (!activeFilters.includes(filter)) {
        activeFilters.push(filter);
        updateFilterBar();
        filterJobs();
      }
    }

    function removeFilter(filter) {
      activeFilters = activeFilters.filter((f) => f !== filter);
      updateFilterBar();
      filterJobs();
    }

    function updateFilterBar() {
      selectedFiltersContainer.innerHTML = ""; // Clear previous filters

      activeFilters.forEach((filter) => {
        const tagElement = document.createElement("span");
        tagElement.classList.add("selected-tag");
        tagElement.innerHTML = `${filter} <span class="remove-tag" data-filter="${filter}">✖</span>`;

        // Add event listener to remove tag
        tagElement
          .querySelector(".remove-tag")
          .addEventListener("click", function () {
            removeFilter(filter);
          });

        selectedFiltersContainer.appendChild(tagElement);
      });

      // Show or hide the filter container
      if (activeFilters.length > 0) {
        filterContainer.classList.add("active");
      } else {
        filterContainer.classList.remove("active");
      }
    }

    function filterJobs() {
      const filteredJobs = data.filter((job) =>
        activeFilters.every(
          (filter) =>
            job.role === filter ||
            job.level === filter ||
            job.languages.includes(filter) ||
            job.tools.includes(filter)
        )
      );

      renderJobs(filteredJobs);
    }

    // Clear all filters
    clearFiltersButton.addEventListener("click", function () {
      activeFilters = [];
      updateFilterBar();
      renderJobs(data); // Show all jobs again
    });

    // Initial render
    renderJobs(data);
  })
  .catch((error) => console.log("Error fetching jobs:", error));
