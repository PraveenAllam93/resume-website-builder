<script lang="ts">
    import { onMount } from 'svelte';

    let visible = false;

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

    onMount(() => {
        fetchData();
        visible = true;
        console.log('projects', projects);
        console.log('projectsNames', projectsNames);
        projectTab = projectsNames[0] || '';
    });

    $: projectNames = projects.map(p => p?.name || "Unnamed Project");
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

            {#if openExperiences[i]}
              <div class="px-6 pb-6 border-t border-violet-100 pt-4 animate-fadein">
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

      <h2 class="text-lg font-bold text-indigo-800">Editor</h2>

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

      <div class="flex-1 overflow-y-auto pr-1">

        {#if tab==='Personal Info'}
          <div class="space-y-3">

            <label class="block text-sm font-medium text-gray-700">Name
              <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={personalInfo.name}>
            </label>

            <label class="block text-sm font-medium text-gray-700">Title
              <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={personalInfo.title}>
            </label>

            <label class="block text-sm font-medium text-gray-700">Bio
              <textarea class="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-300" bind:value={personalInfo.bio}></textarea>
            </label>

            <h3 class="font-semibold mt-2">Contact</h3>

            {#each Object.keys(personalInfo?.contact ?? {}) as key}
              <label class="block text-sm capitalize">{key}
                <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={(personalInfo.contact as any)[key]}>
              </label>
            {/each}

          </div>
        {/if}
        {#if tab==='Summary'}
          <label class="block text-sm font-medium text-gray-700">Summary
            <textarea class="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-300" bind:value={summary} rows="6"></textarea>
          </label>
        {/if}
        {#if tab==='Experience'}
          {#each experiences as experience }
            <div class="mb-4 p-3 border rounded-lg">
                <label class="block text-sm font-medium text-gray-700">Company
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={experience.company}>
                </label>

                <label class="block text-sm mt-2">Role
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={experience.role}>
                </label>

                <label class="block text-sm mt-2">Start Date
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={experience.start_date}>
                </label>

                <label class="block text-sm mt-2">End Date
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={experience.end_date}>
                </label>

                <label class="block text-sm mt-2">Location
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={experience.location}>
                </label>

                <label class="block text-sm mt-2">Highlights (one per line)
                    <textarea
                        class="mt-1 w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-300"
                        value={(experience.highlights || []).join('\n')}
                        on:input={(e) => {
                            experience.highlights = (e.target as HTMLInputElement)
                            .value
                            .split('\n')
                            .map(s => s.trim())
                            .filter(Boolean);
                        }}
                        rows="4"></textarea>
                </label>
            </div>
            
          {/each}
        {/if}
        {#if tab==='Education'}
          {#each educations as edu}
            <div class="mb-4 p-3 border rounded-lg">
                <label class="block text-sm font-medium text-gray-700">Institution
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={edu.institution}>
                </label>

                <label class="block text-sm mt-2">Degree
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={edu.degree}>
                </label>

                <label class="block text-sm mt-2">Field of Study
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={edu.field_of_study}>
                </label>

                <label class="block text-sm mt-2">Start Date
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={edu.start_date}>
                </label>

                <label class="block text-sm mt-2">End Date
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={edu.end_date}>
                </label>

                <label class="block text-sm mt-2">Grade
                    <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={edu.grade}>
                </label>
            </div>
          {/each}
        {/if}
        {#if tab === 'Projects'}
          <!-- PROJECT TABS -->
          <div class="flex flex-wrap gap-2 mb-4">
            {#each projectNames as t}
              <button
                class="px-3 py-1.5 rounded-xl border text-sm transition font-medium
                      hover:bg-indigo-50 hover:border-indigo-300"
                class:bg-indigo-600={projectTab === t}
                class:text-white={projectTab === t}
                on:click={() => projectTab = t}
              >
                {t}
              </button>
            {/each}
          </div>

          <!-- PROJECT FORM -->
          {#each projects as proj}
            {#if projectTab === (proj.name ?? 'Unnamed Project')}
              <div class="mb-6 p-4 border rounded-xl shadow-sm bg-white space-y-3">

                <!-- NAME -->
                <label class="block text-sm font-semibold text-gray-700">
                  Name
                  <input
                    class="mt-1 w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-indigo-300"
                    bind:value={proj.name}
                  >
                </label>

                <!-- DESCRIPTION -->
                <label class="block text-sm font-semibold text-gray-700">
                  Description
                  <textarea
                    rows="3"
                    class="mt-1 w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-indigo-300"
                    bind:value={proj.description}
                  ></textarea>
                </label>

                <!-- KEY POINTS -->
                <label class="block text-sm font-semibold text-gray-700">
                  Key Points (one per line)
                  <textarea
                    rows="4"
                    class="mt-1 w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-indigo-300"
                    value={(proj.key_points || []).join('\n')}
                    on:input={(e) => {
                      proj.key_points = e.target.value
                        .split('\n')
                        .map(s => s.trim())
                        .filter(Boolean);
                    }}
                  ></textarea>
                </label>

                <!-- TECH STACK -->
                <label class="block text-sm font-semibold text-gray-700">
                  Tech Stack (comma separated)
                  <input
                    class="mt-1 w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-indigo-300"
                    value={(proj.tech_stack || []).join(', ')}
                    on:input={(e) => {
                      proj.tech_stack = e.target.value
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean);
                    }}
                  />
                </label>

                <!-- URL -->
                {#if proj.url}
                  <label class="block text-sm font-semibold text-gray-700">
                    URL
                    <input
                      class="mt-1 w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-indigo-300"
                      bind:value={proj.url}
                    >
                  </label>
                {/if}

                <!-- IMAGE -->
                {#if proj.image_url}
                  <label class="block text-sm font-semibold text-gray-700">
                    Image URL
                    <input
                      class="mt-1 w-full border rounded-xl p-2 text-sm focus:ring-2 focus:ring-indigo-300"
                      bind:value={proj.image_url}
                    >
                  </label>
                {/if}

              </div>
            {/if}
          {/each}
        {/if}
        {#if tab==='Skills'}
            {#each skills as skillCat}
                <div class="mb-4 p-3 border rounded-lg">
                    <label class="block text-sm font-medium text-gray-700">Category Name
                        <input class="mt-1 w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" bind:value={skillCat.category_name}>
                    </label>
    
                    <label class="block text-sm mt-2">Skills (comma separated)
                        <input
                        class="mt-1 w-full border rounded p-1"
                        value={(skillCat.skills || []).join(', ')}
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