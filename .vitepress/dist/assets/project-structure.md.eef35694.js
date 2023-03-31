import{_ as s,c as n,o as a,N as e}from"./chunks/framework.0799945b.js";const u=JSON.parse('{"title":"Project Structure","description":"","frontmatter":{},"headers":[],"relativePath":"project-structure.md"}'),p={name:"project-structure.md"},l=e(`<h1 id="project-structure" tabindex="-1">Project Structure <a class="header-anchor" href="#project-structure" aria-label="Permalink to &quot;Project Structure&quot;">​</a></h1><p>The recommend project structure for medium to large application is a hybrid between the split-by-type and split-by-module. All the folders in the <code>src</code> (root) contain shared code. ( services, stores, types, ...)</p><p>The module folder contains multiple folders grouped by &quot;features&quot; eg. <strong>employees</strong>. Each module contains all of the different types.</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">- src</span></span>
<span class="line"><span style="color:#A6ACCD;">  - services (shared services)</span></span>
<span class="line"><span style="color:#A6ACCD;">    - example.service.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">    - ...</span></span>
<span class="line"><span style="color:#A6ACCD;">  - components (shared components)</span></span>
<span class="line"><span style="color:#A6ACCD;">    - TheHeader.vue</span></span>
<span class="line"><span style="color:#A6ACCD;">    - TheFooter.vue</span></span>
<span class="line"><span style="color:#A6ACCD;">    - ...</span></span>
<span class="line"><span style="color:#A6ACCD;">  - icons</span></span>
<span class="line"><span style="color:#A6ACCD;">  - composables (shared composables)</span></span>
<span class="line"><span style="color:#A6ACCD;">    - saving.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">    - ...</span></span>
<span class="line"><span style="color:#A6ACCD;">  - modules</span></span>
<span class="line"><span style="color:#A6ACCD;">    - accidents</span></span>
<span class="line"><span style="color:#A6ACCD;">        - components</span></span>
<span class="line"><span style="color:#A6ACCD;">            - AccidentList.vue</span></span>
<span class="line"><span style="color:#A6ACCD;">            - AccidentDetail.vue</span></span>
<span class="line"><span style="color:#A6ACCD;">            - ...</span></span>
<span class="line"><span style="color:#A6ACCD;">        - services</span></span>
<span class="line"><span style="color:#A6ACCD;">            - accident.service.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">            - ...</span></span>
<span class="line"><span style="color:#A6ACCD;">        - composables</span></span>
<span class="line"><span style="color:#A6ACCD;">            - ...</span></span>
<span class="line"><span style="color:#A6ACCD;">        - ...</span></span>
<span class="line"><span style="color:#A6ACCD;">  - router</span></span>
<span class="line"><span style="color:#A6ACCD;">  - stores (shared stores)</span></span>
<span class="line"><span style="color:#A6ACCD;">  - types (shared types)</span></span>
<span class="line"><span style="color:#A6ACCD;">  - views (shared views)</span></span>
<span class="line"><span style="color:#A6ACCD;">    - Error404View.vue</span></span>
<span class="line"><span style="color:#A6ACCD;">    - ...</span></span>
<span class="line"><span style="color:#A6ACCD;">  - main.ts</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h3 id="shared-components-folder-structure" tabindex="-1">Shared components folder structure <a class="header-anchor" href="#shared-components-folder-structure" aria-label="Permalink to &quot;Shared components folder structure&quot;">​</a></h3><p>Each project is always going to contain multiple components that are shared accross multiple modules and views. The recommended structure is to have a finite number of root folders like <code>app</code>, <code>form</code>, <code>table</code>, <code>layout</code>, ... Each folder contains the matching component type eg. <code>AppButton.vue</code> or <code>FormInput.vue</code>. It&#39;s also a good practice to give each component it&#39;s own folder so that you can add story (Storybook/Histoire) or test files.</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">- assets</span></span>
<span class="line"><span style="color:#A6ACCD;">- components</span></span>
<span class="line"><span style="color:#A6ACCD;">    - app</span></span>
<span class="line"><span style="color:#A6ACCD;">        - button</span></span>
<span class="line"><span style="color:#A6ACCD;">            - AppButton.vue</span></span>
<span class="line"><span style="color:#A6ACCD;">            - AppButton.story.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">            - AppButton.spec.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">        - card</span></span>
<span class="line"><span style="color:#A6ACCD;">            - AppCard.vue</span></span>
<span class="line"><span style="color:#A6ACCD;">            - AppCard.story.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">            - title</span></span>
<span class="line"><span style="color:#A6ACCD;">                - AppCardTitle.vue</span></span>
<span class="line"><span style="color:#A6ACCD;">                - AppCardTitle.story.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">    - form</span></span>
<span class="line"><span style="color:#A6ACCD;">        - select</span></span>
<span class="line"><span style="color:#A6ACCD;">            - FormSelect.vue</span></span>
<span class="line"><span style="color:#A6ACCD;">            - FormSelect.story.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">            - FormSelect.spec.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">        - birthday-picker</span></span>
<span class="line"><span style="color:#A6ACCD;">            - FormBirthdayPicker.vue</span></span>
<span class="line"><span style="color:#A6ACCD;">            - FormBirthdayPicker.story.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">    - calendars</span></span>
<span class="line"><span style="color:#A6ACCD;">        - planning</span></span>
<span class="line"><span style="color:#A6ACCD;">            - CalendarPlanning.vue</span></span>
<span class="line"><span style="color:#A6ACCD;">            - CalendarPlanning.story.ts</span></span>
<span class="line"><span style="color:#A6ACCD;">- composables</span></span>
<span class="line"><span style="color:#A6ACCD;">- ...</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>`,7),o=[l];function t(c,r,i,A,C,d){return a(),n("div",null,o)}const D=s(p,[["render",t]]);export{u as __pageData,D as default};
