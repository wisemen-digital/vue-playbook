import{_ as s,c as n,o as a,N as e}from"./chunks/framework.0799945b.js";const D=JSON.parse('{"title":"Design patterns","description":"","frontmatter":{},"headers":[],"relativePath":"design-patterns.md"}'),l={name:"design-patterns.md"},p=e(`<h1 id="design-patterns" tabindex="-1">Design patterns <a class="header-anchor" href="#design-patterns" aria-label="Permalink to &quot;Design patterns&quot;">​</a></h1><p>Design patterns are solutions to common problems in software design. Each pattern is like a blueprint that you can customize to solve a particular design problem in your code.</p><h2 id="builder-pattern" tabindex="-1">Builder pattern <a class="header-anchor" href="#builder-pattern" aria-label="Permalink to &quot;Builder pattern&quot;">​</a></h2><p>Builder is a creational design pattern, which allows constructing complex objects step by step.</p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#A6ACCD;">class StringBuilder {</span></span>
<span class="line"><span style="color:#A6ACCD;">  result = &#39;&#39;;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  append(value: string): StringBuilder {</span></span>
<span class="line"><span style="color:#A6ACCD;">    this.result += value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    return this;</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">  toString(): string {</span></span>
<span class="line"><span style="color:#A6ACCD;">    return this.result;</span></span>
<span class="line"><span style="color:#A6ACCD;">  }</span></span>
<span class="line"><span style="color:#A6ACCD;">}</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">const stringBuilder = new StringBuilder();</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">const result = stringBuilder</span></span>
<span class="line"><span style="color:#A6ACCD;">  .append(&#39;Test&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;">  .append(&#39;Wisemen&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;">  .append(&#39;Cool&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;">  .append(&#39;Chaining!&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;">  .append(&#39;Great times!&#39;)</span></span>
<span class="line"><span style="color:#A6ACCD;">  .toString();</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">console.log(result); // output: TestWisemenCoolChaining!Great times!</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div>`,5),t=[p];function o(r,i,c,C,A,d){return a(),n("div",null,t)}const g=s(l,[["render",o]]);export{D as __pageData,g as default};
