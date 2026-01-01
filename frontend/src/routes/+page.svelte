<script lang="ts">
    import { onMount } from 'svelte';

    let visible = false;
    let selectedIndex: number = 0;
    let editingTab: string | null = null;
    let editingIndex: number | null = null;
    const isEditing = (t:string, i?:number) =>
      editingTab === t && editingIndex === i;

    const isListTab = (t:string) =>
      ['Projects','Experience','Education','Skills'].includes(t);


    let aiOpen = false;
    let aiInput = "";
    let aiLoading = false;
    let aiError = ""; 

    let data: any = 'No data yet';
    let openProjects: Record<number, boolean> = {};
    let openExperiences: Record<number, boolean> = {};
    let projectsNames: string[] = [];

    type Contact = {
        email: string | null;
        phone: string | null;
        linkedin: string | null;
        github: string | null;
        website: string | null;
        location: string | null;
    };

    type PersonalInfo = {
        name: string;
        title: string | null;
        contact: Contact;
        bio: string | null;
    };

    type Experience = {
        company: string | null;
        role: string | null;
        start_date: string | null;
        end_date: string | null;
        is_current: boolean | null;
        location: string | null;
        highlights: string[] | null;
    };

    type Education = {
        institution: string | null;
        degree: string | null;
        field_of_study: string | null;
        start_date: string | null;
        end_date: string | null;
        grade: string | null;
    };

    type Projects = {
        name: string | null;
        description: string | null;
        tech_stack: string[] | null;
        key_points: string[] | null;
        url: string | null;
        image_url: string | null;
    };

    type Skills = {
        category_name: string | null;
        skills: string[] | null;
    };

    let tab = 'Personal Info';
    let projectTab: string;

    let personalInfo: PersonalInfo = {
        name: '',
        title: '',
        bio: '',
        contact: {
            email: '',
            phone: '',
            linkedin: '',
            github: '',
            website: '',
            location: ''
        }
    };

    let summary = '';
    let experiences: Experience[] = [];
    let educations: Education[] = [];
    let projects: Projects[] = [];
    let skills: Skills[] = [];

    async function fetchData() {
        try {
            const response = await fetch('/api/backend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const result = await response.json();
                data = result?.data;

                personalInfo = data?.personal_info ?? personalInfo;
                summary = data?.summary ?? '';
                experiences = data?.experience ?? [];
                educations = data?.education ?? [];
                projects = data?.projects ?? [];
                projectsNames = projects.map(p => p.name ?? 'Unnamed Project');
                skills = data?.skills ?? [];
            }
        } catch (e) {
            console.error(e);
        }
    }

    function saveTab(tab: string) {
      if (tab === 'Personal Info') {
        data.personal_info = personalInfo;
      }

      if (tab === 'Summary') {
        data.summary = summary;
      }

      if (tab === 'Experience') {
        data.experience = experiences;
      }

      if (tab === 'Education') {
        data.education = educations;
      }

      if (tab === 'Projects') {
        data.projects = projects;
      }

      if (tab === 'Skills') {
        data.skills = skills;
      }
    }

    function saveItem(tab:string, index:number) {

      if (tab === 'Personal Info') {
        data.personal_info = personalInfo;
      }

      if (tab === 'Summary') {
        data.summary = summary;
      }
      if (tab === 'Projects') {
        data.projects[index] = projects[index];
      }

      if (tab === 'Experience') {
        data.experience[index] = experiences[index];
      }

      if (tab === 'Education') {
        data.education[index] = educations[index];
      }

      if (tab === 'Skills') {
        data.skills[index] = skills[index];
      }
    }

    async function handleEditClick() {
      if (editingTab === tab && editingIndex === selectedIndex) {
        saveItem(tab, selectedIndex);
        editingTab = null;
        editingIndex = null;
        return;
      }

      editingTab = tab;
      editingIndex = selectedIndex;
    }

    function getTabJson() {
      switch (tab) {
        case 'Projects': return projects[selectedIndex];
        case 'Experience': return experiences[selectedIndex];
        case 'Education': return educations[selectedIndex];
        case 'Personal Info': return personalInfo;
        case 'Summary': return summary;
        case 'Education': return educations;
        case 'Projects': return projects;
        case 'Skills': return skills;
      }
    }

    function applyAIResult(result: any) {
      switch (tab) {
        case 'Personal Info':
          personalInfo = result;
          data.personal_info = result;
          break;

        case 'Summary':
          summary = result;
          data.summary = result;
          break;

        case 'Experience':
          experiences[selectedIndex] = result;
          data.experience[selectedIndex] = result;
          break;

        case 'Education':
          educations[selectedIndex] = result;
          data.education[selectedIndex] = result;
          break;

        case 'Projects':
          projects[selectedIndex] = result;
          data.projects[selectedIndex] = result;
          break;

        case 'Skills':
          skills = result;
          data.skills = result;
          break;
      }
    }

    async function sendToAI() {
      aiLoading = true;
      aiError = "";

      const payload = {
        section_name: tab,
        instruction: aiInput,
        current_content: getTabJson()
      };

      try {
        // const res = await fetch("/api/ai-update", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(payload)
        // });

        // if (res.status === 400) {
        //   aiError = "AI could not update this content.";
        //   aiLoading = false;
        //   return;
        // }

        // if (!res.ok) {
        //   aiError = "Something went wrong.";
        //   aiLoading = false;
        //   return;
        // }

        // const result = await res.json();

        // MOCK AI RESPONSE FOR TESTING
        await new Promise((r) => setTimeout(r, 1500)); // simulate delay
        const result = {
          data: payload.current_content // echo back current content
        };
        
        // create a fake modification for demo purposes
        if (tab === 'Summary' && typeof result.data === 'string') {
          result.data = result.data + " (Updated by AI)";
        }

        // Mock for all tabs - in real scenario, AI would return modified content
        // e.g., if tab is 'Personal Info', result.data would be modified personalInfo object, use selectedIndex for list tabs
        if (tab === 'Personal Info') {
          if (result.data?.name) {
            result.data.name = result.data.name + " (AI)";
          }
        }

        // for experience tab use selectedIndex
        if (tab === 'Experience' && experiences[selectedIndex]) {
          result.data.role = (result.data.role || "") + " (AI)";
        }
        if (tab === 'Projects' && projects[selectedIndex]) {
          result.data.name = (result.data.name || "") + " (AI)";
        }
        if (tab === 'Education' && educations[selectedIndex]) {
          result.data.degree = (result.data.degree || "") + " (AI)";
        }
        if (tab === 'Skills') {
          if (Array.isArray(result.data.skills)) {
            result.data.skills = result.data.skills.map((s: string) => s + " (AI)");
          }
        }

        // update UI only on success
        applyAIResult(result?.data);

        // close AI panel & clear input
        aiOpen = false;
        aiInput = "";

      } catch (e) {
        aiError = "Network error.";
      }

      aiLoading = false;
    }

    onMount(() => {
        fetchData();
        visible = true;
        console.log('projects', projects);
        console.log('projectsNames', projectsNames);
        projectTab = projectsNames[0] || '';
    });

    // $: projectNames = projects.map(p => p?.name || "Unnamed Project");
    $: if (!isListTab(tab)) {
      selectedIndex = 0;
    }
</script>


{#if visible}
<div class="min-h-screen bg-gradient-to-b from-rose-50 via-violet-50 to-slate-50 flex">

  <!-- MAIN -->
  <main class="w-full lg:w-7/10 flex-grow" style="flex-basis:70%;">
    <div class="max-w-5xl mx-auto px-6 py-16 space-y-24">

      <!-- HERO -->
      <section>
        <div class="flex flex-col md:flex-row gap-12 items-center">

          <div class="flex-1">
            <p class="uppercase tracking-widest text-sm text-violet-500">
              Portfolio
            </p>

            <h1 class="text-5xl font-serif font-bold text-slate-900 mt-2">
              {personalInfo?.name}
            </h1>

            {#if personalInfo?.title}
              <p class="text-xl text-slate-600 mt-3">
                {personalInfo.title}
              </p>
            {/if}

            {#if personalInfo?.bio}
              <p class="mt-6 text-slate-700 leading-relaxed max-w-xl">
                {personalInfo.bio}
              </p>
            {/if}

            <div class="mt-8 flex gap-6 text-sm font-medium">
              {#if personalInfo?.contact?.github}
                <a class="text-violet-700 hover:underline" href={personalInfo.contact.github} target="_blank">GitHub</a>
              {/if}
              {#if personalInfo?.contact?.linkedin}
                <a class="text-violet-700 hover:underline" href={personalInfo.contact.linkedin} target="_blank">LinkedIn</a>
              {/if}
              {#if personalInfo?.contact?.email}
                <a class="text-violet-700 hover:underline" href={`mailto:${personalInfo.contact.email}`}>Email</a>
              {/if}
            </div>
          </div>

          <div class="flex-1 hidden md:block"></div>
        </div>
      </section>

      <!-- SUMMARY -->
      {#if summary}
        <section>
          <h2 class="text-4xl font-serif font-bold text-slate-900 mb-4">
            Summary
          </h2>

          <p class="text-slate-700 leading-relaxed max-w-3xl">
            {summary}
          </p>
        </section>
      {/if}


      <!-- PROJECTS -->
      {#if projects?.length}
      <section>
        <h2 class="text-4xl font-serif font-bold text-slate-900 mb-8">
          Featured Projects
        </h2>

        <div class="grid md:grid-cols-2 gap-10">

          {#each projects as proj, i}
          <div class="rounded-3xl border border-violet-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition overflow-hidden">

            {#if proj.image_url}
              <img src={proj.image_url} class="w-full h-52 object-cover" alt={proj.name}>
            {/if}

            <div class="p-7">

              <h3 class="text-xl font-semibold text-slate-900">
                {proj.name}
              </h3>

              <p class="text-slate-600 mt-2">
                {proj.description}
              </p>

              <div class="flex flex-wrap gap-2 mt-3">
                {#each proj.tech_stack ?? [] as t}
                  <span class="px-3 py-1 bg-violet-50 text-violet-800 rounded-lg text-xs">
                    {t}
                  </span>
                {/each}
              </div>


            <button
                class="mt-5 text-sm font-medium text-violet-700 hover:text-violet-900"
                on:click={() => openProjects[i] = !openProjects[i]}>
                {openProjects[i] ? 'Hide details' : 'Show details'}
            </button>

            {#if openProjects[i]}
            <div class="mt-3 border-t pt-3 text-sm text-slate-700 animate-fadein">
                {#if proj.key_points?.length}
                <ul class="list-disc ml-6 space-y-1">
                    {#each proj.key_points as point}
                    <li>{point}</li>
                    {/each}
                </ul>
                {/if}
            </div>
            {/if}

            {#if proj.url}
            <div class="mt-4">
                <a
                href={proj.url}
                target="_blank"
                rel="noopener noreferrer"
                class="text-violet-700 font-medium hover:underline"
                >
                View Project →
                </a>
            </div>
            {/if}

            </div>
          </div>
          {/each}

        </div>
      </section>
      {/if}


      <!-- EXPERIENCE -->
      {#if experiences?.length}
      <section>
        <h2 class="text-4xl font-serif font-bold text-slate-900 mb-8">
          Experience
        </h2>

        <div class="space-y-6">

          {#each experiences as exp, i}
          <div class="rounded-2xl border border-violet-100 bg-white shadow-sm hover:shadow-md transition">

            <div class="p-6 flex justify-between gap-4">

              <div>
                <h3 class="text-lg font-semibold text-slate-900">
                  {exp.role}
                  <span class="text-violet-700 font-normal"> @ {exp.company}</span>
                </h3>

                <p class="text-sm text-slate-500">
                  {exp.start_date} – {exp.end_date} • {exp.location}
                </p>
              </div>

              <button
                class="text-sm text-violet-700 hover:text-violet-900"
                on:click={() => openExperiences[i] = !openExperiences[i]}>
                {openExperiences[i] ? 'Hide details' : 'Show details'}
              </button>

            </div>

            {#if openExperiences[i] && exp.highlights?.length}
              <div class="px-6 pb-6 border-t pt-3 text-sm text-slate-700 animate-fadein">
                <ul class="list-disc ml-6 space-y-1 text-sm text-slate-700">
                  {#each exp.highlights ?? [] as h}
                    <li>{h}</li>
                  {/each}
                </ul>
              </div>
            {/if}

          </div>
          {/each}

        </div>
      </section>
      {/if}

      <!-- EDUCATION -->
      {#if educations?.length}
      <section>
        <h2 class="text-4xl font-serif font-bold text-slate-900 mb-8">
          Education
        </h2>

        <div class="space-y-6">

          {#each educations as edu}
          <div class="rounded-2xl border border-violet-100 bg-white shadow-sm hover:shadow-md transition">

            <div class="p-6">
              <h3 class="text-lg font-semibold text-slate-900">
                {edu.degree}
                <span class="text-violet-700 font-normal">
                  @ {edu.institution}
                </span>
              </h3>

              <p class="text-sm text-slate-500 mt-1">
                {edu.start_date} – {edu.end_date}
                {#if edu.field_of_study} • {edu.field_of_study}{/if}
              </p>

              {#if edu.grade}
              <p class="text-sm text-slate-600 mt-2">
                Grade: {edu.grade}
              </p>
              {/if}
            </div>

          </div>
          {/each}

        </div>
      </section>
      {/if}


      <!-- SKILLS -->
      {#if skills?.length}
      <section>
        <h2 class="text-4xl font-serif font-bold text-slate-900 mb-8">
          Skills
        </h2>

        <div class="space-y-8">
          {#each skills as s}
            <div>
              <h3 class="font-semibold text-slate-800 mb-2">{s.category_name}</h3>

              <div class="flex flex-wrap gap-2">
                {#each s.skills ?? [] as skill}
                  <span class="px-3 py-1 bg-slate-100 rounded-full text-sm">
                    {skill}
                  </span>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </section>
      {/if}


      <!-- CTA -->
      <section class="text-center pt-10">
        <h2 class="text-4xl font-serif font-bold text-slate-900">
          Let’s Work Together
        </h2>

        <p class="text-slate-600 mt-2">
          I’m open to freelance, full-time roles, and collaborations.
        </p>

        <a href="mailto:{personalInfo?.contact?.email}"
           class="inline-block mt-5 px-7 py-3 bg-violet-700 text-white rounded-xl shadow hover:bg-violet-800">
           Contact Me
        </a>
      </section>

    </div>
  </main>



  <aside class="hidden lg:block border-l border-indigo-100 bg-white h-screen sticky top-0" style="flex-basis:30%;">
    <div class="p-5 h-full flex flex-col space-y-4">

      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-indigo-800">Editor</h2>

        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 text-sm rounded-lg border text-indigo-700"
            on:click={() => aiOpen = !aiOpen}
          >
            Use AI
          </button>

          <button
            class="px-3 py-1.5 text-sm rounded-lg border font-medium"
            class:bg-indigo-600={editingTab === tab}
            class:text-white={editingTab === tab}
            on:click={handleEditClick}
          >
            {editingTab === tab ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 mb-2 text-sm">
        {#each ['Personal Info','Summary','Experience','Education','Projects','Skills'] as t}
          <button
            class="px-3 py-1.5 rounded-lg border transition"
            class:bg-indigo-600={tab===t}
            class:text-white={tab===t}
            on:click={() => tab=t}>{t}</button>
        {/each}
      </div>

      {#if aiOpen}
        <div class="p-3 border rounded-xl bg-indigo-50 space-y-2">

          <p class="text-sm font-semibold text-indigo-800">
            Describe what you want to update for: {tab}
          </p>

          <textarea
            class="w-full border rounded-lg p-2 text-sm"
            rows="4"
            bind:value={aiInput}
            placeholder="e.g. Rewrite my summary to sound more professional..."
          ></textarea>

          {#if aiError}
            <p class="text-sm text-red-600">{aiError}</p>
          {/if}

          <button
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow
                  disabled:opacity-60 disabled:cursor-not-allowed"
            on:click={sendToAI}
            disabled={aiLoading || !aiInput.trim()}>
            {aiLoading ? 'Thinking…' : 'Send to AI'}
          </button>

        </div>
      {/if}

      <div class="flex-1 overflow-y-auto pr-1">

        {#if tab==='Personal Info'}
          <div class="space-y-3">

            <label class="block text-sm font-medium text-gray-700">Name
              <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Personal Info')} bind:value={personalInfo.name}>
            </label>

            <label class="block text-sm font-medium text-gray-700">Title
              <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Personal Info')} bind:value={personalInfo.title}>
            </label>

            <label class="block text-sm font-medium text-gray-700">Bio
              <textarea class="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Personal Info')} bind:value={personalInfo.bio}></textarea>
            </label>

            <h3 class="font-semibold mt-2">Contact</h3>

            {#each Object.keys(personalInfo?.contact ?? {}) as key}
              <label class="block text-sm capitalize">{key}
                <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Personal Info')} bind:value={(personalInfo.contact as any)[key]}>
              </label>
            {/each}

          </div>
        {/if}
        {#if tab==='Summary'}
          <label class="block text-sm font-medium text-gray-700">Summary
            <textarea class="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Summary')} bind:value={summary} rows="6"></textarea>
          </label>
        {/if}
        {#if tab==='Experience'}

          <div class="flex gap-3 border-b pb-2 mb-3">

            {#each experiences as p, i}
              <button
                class="px-3 py-1 text-sm font-medium"
                class:border-b-2={selectedIndex === i}
                class:border-black={selectedIndex === i}
                on:click={() => selectedIndex = i}
              >
                Experience #{i+1}
              </button>
            {/each}

          </div>

          {#if experiences[selectedIndex]}
          <div class="space-y-3">

              <label class="text-sm font-semibold">
                Company
                <input
                  disabled={!isEditing('Experience', selectedIndex)}
                  bind:value={experiences[selectedIndex].company}
                  class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </label>

              <label class="text-sm font-semibold">
                Role
                <input
                  disabled={!isEditing('Experience', selectedIndex)}
                  bind:value={experiences[selectedIndex].role}
                  class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </label>

              <label class="text-sm font-semibold">
                Start Date
                <input
                  disabled={!isEditing('Experience', selectedIndex)}
                  bind:value={experiences[selectedIndex].start_date}
                  class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </label>

              <label class="text-sm font-semibold">
                End Date
                <input
                  disabled={!isEditing('Experience', selectedIndex)}
                  bind:value={experiences[selectedIndex].end_date}
                  class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </label>

              <label class="text-sm font-semibold">
                Location
                <input
                  disabled={!isEditing('Experience', selectedIndex)}
                  bind:value={experiences[selectedIndex].location}
                  class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </label>

              <label class="block text-sm mt-2">Highlights (one per line)
                  <textarea
                      class="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-300"
                      value={(experiences[selectedIndex].highlights || []).join('\n')}
                      disabled={!isEditing('Summary')}
                      on:input={(e) => {
                          experiences[selectedIndex].highlights = (e.target as HTMLInputElement)
                          .value
                          .split('\n')
                          .map(s => s.trim())
                          .filter(Boolean);
                      }}
                      rows="4"></textarea>
              </label>
            </div>

          {/if}

        {/if}
        {#if tab==='Education'}
          {#each educations as edu}
            <div class="mb-4 p-3 border rounded-lg">
                <label class="block text-sm font-medium text-gray-700">Institution
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Education')} bind:value={edu.institution}>
                </label>

                <label class="block text-sm mt-2">Degree
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Education')} bind:value={edu.degree}>
                </label>

                <label class="block text-sm mt-2">Field of Study
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Education')} bind:value={edu.field_of_study}>
                </label>

                <label class="block text-sm mt-2">Start Date
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Education')} bind:value={edu.start_date}>
                </label>

                <label class="block text-sm mt-2">End Date
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Education')} bind:value={edu.end_date}>
                </label>

                <label class="block text-sm mt-2">Grade
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Education')} bind:value={edu.grade}>
                </label>
            </div>
          {/each}
        {/if}
        

        {#if tab === 'Projects'}
          <div class="flex gap-3 border-b pb-2 mb-3">

            {#each projects as p, i}
              <button
                class="px-3 py-1 text-sm font-medium"
                class:border-b-2={selectedIndex === i}
                class:border-black={selectedIndex === i}
                on:click={() => selectedIndex = i}
              >
                Project #{i+1}
              </button>
            {/each}

          </div>
          {#if projects[selectedIndex]}
            <div class="space-y-3">

              <label class="text-sm font-semibold">
                Name
                <input
                  disabled={!isEditing('Projects', selectedIndex)}
                  bind:value={projects[selectedIndex].name}
                  class="mt-1 w-full border rounded-lg p-2 text-sm"
                />
              </label>

              <label class="text-sm font-semibold">
                Description
                <textarea
                  disabled={!isEditing('Projects', selectedIndex)}
                  bind:value={projects[selectedIndex].description}
                  rows="3"
                  class="mt-1 w-full border rounded-lg p-2 text-sm"
                ></textarea>
              </label>

              <label class="text-sm font-semibold">
                Key Points
                <textarea
                  disabled={!isEditing('Projects', selectedIndex)}
                  value={(projects[selectedIndex].key_points || []).join('\n')}
                  on:input={(e) => {
                    projects[selectedIndex].key_points =
                      (e.target as HTMLInputElement).value
                        .split('\n')
                        .map(s=>s.trim())
                        .filter(Boolean)
                  }}
                  rows="4"
                  class="mt-1 w-full border rounded-lg p-2 text-sm"
                ></textarea>
              </label>

              <!-- TECH STACK -->
                <label class="block text-sm font-semibold text-gray-700">
                  Tech Stack (comma separated)
                  <input
                    class="mt-1 w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-indigo-300"
                    value={(projects[selectedIndex].tech_stack || []).join(', ')}
                    on:input={(e) => {
                      projects[selectedIndex].key_points = ((e.target as HTMLInputElement)?.value || '')
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean);
                    }}
                  />
                </label>

                <!-- URL -->
                {#if projects[selectedIndex].url}
                  <label class="block text-sm font-semibold text-gray-700">
                    URL
                    <input
                      class="mt-1 w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-indigo-300"
                      bind:value={projects[selectedIndex].url}
                    >
                  </label>
                {/if}

                <!-- IMAGE -->
                {#if projects[selectedIndex].image_url}
                  <label class="block text-sm font-semibold text-gray-700">
                    Image URL
                    <input
                      class="mt-1 w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-indigo-300"
                      bind:value={projects[selectedIndex].image_url}
                    >
                  </label>
                {/if}


            </div>
          {/if}
        {/if}

        {#if tab==='Skills'}
            {#each skills as skillCat}
                <div class="mb-4 p-3 border rounded-lg">
                    <label class="block text-sm font-medium text-gray-700">Category Name
                        <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" disabled={!isEditing('Skills')} bind:value={skillCat.category_name}>
                    </label>
    
                    <label class="block text-sm mt-2">Skills (comma separated)
                        <input
                        class="mt-1 w-full border rounded p-1"
                        value={(skillCat.skills || []).join(', ')}
                        disabled={!isEditing('Skills')}
                        on:input={(e) => {
                            skillCat.skills = (e.target as HTMLInputElement)
                            .value
                            .split(',')
                            .map(s => s.trim())
                            .filter(Boolean);
                        }}
                        />
                    </label>
                </div>
            {/each}
        {/if}

      </div>

    </div>
  </aside>

</div>
{/if}


<style>
  .animate-fadein {
    animation: fadein .25s ease;
  }
  @keyframes fadein {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>