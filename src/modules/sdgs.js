import "../styles/sdgs.css";

/*
  SDG Learning Section

  This section helps users explore all 17 Sustainable Development Goals.
  The 18th card is for cross-SDG projects that combine multiple goals.
*/

export function renderSdgs() {
  return `
    <section class="sdgs-section" id="sdgs">
      <div class="sdgs-wrap">

        <div class="sdgs-header">
          <div>
            <div class="sdgs-eyebrow">🌍 Learn SDGs</div>
            <h2>Explore by SDG Focus</h2>
            <p>
              Learn the goals, discover related projects, and find opportunities
              connected to each Sustainable Development Goal.
            </p>
          </div>

          <a href="#" class="sdgs-learn-btn">Start Learning →</a>
        </div>

        <div class="sdg-grid">
          <div class="sdg-card sdg-1"><span>1</span><h3>No Poverty</h3><p>End poverty everywhere.</p></div>
          <div class="sdg-card sdg-2"><span>2</span><h3>Zero Hunger</h3><p>Food security for all.</p></div>
          <div class="sdg-card sdg-3"><span>3</span><h3>Good Health</h3><p>Healthy lives and wellbeing.</p></div>
          <div class="sdg-card sdg-4"><span>4</span><h3>Quality Education</h3><p>Inclusive lifelong learning.</p></div>
          <div class="sdg-card sdg-5"><span>5</span><h3>Gender Equality</h3><p>Equal rights and opportunity.</p></div>
          <div class="sdg-card sdg-6"><span>6</span><h3>Clean Water</h3><p>Safe water and sanitation.</p></div>
          <div class="sdg-card sdg-7"><span>7</span><h3>Clean Energy</h3><p>Affordable sustainable energy.</p></div>
          <div class="sdg-card sdg-8"><span>8</span><h3>Decent Work</h3><p>Jobs and economic growth.</p></div>
          <div class="sdg-card sdg-9"><span>9</span><h3>Innovation</h3><p>Industry and infrastructure.</p></div>
          <div class="sdg-card sdg-10"><span>10</span><h3>Reduced Inequalities</h3><p>Fairer societies for all.</p></div>
          <div class="sdg-card sdg-11"><span>11</span><h3>Sustainable Cities</h3><p>Inclusive, safe communities.</p></div>
          <div class="sdg-card sdg-12"><span>12</span><h3>Responsible Consumption</h3><p>Reduce waste and reuse.</p></div>
          <div class="sdg-card sdg-13"><span>13</span><h3>Climate Action</h3><p>Act against climate change.</p></div>
          <div class="sdg-card sdg-14"><span>14</span><h3>Life Below Water</h3><p>Protect oceans and coasts.</p></div>
          <div class="sdg-card sdg-15"><span>15</span><h3>Life on Land</h3><p>Protect forests and wildlife.</p></div>
          <div class="sdg-card sdg-16"><span>16</span><h3>Peace & Justice</h3><p>Strong and fair institutions.</p></div>
          <div class="sdg-card sdg-17"><span>17</span><h3>Partnerships</h3><p>Collaborate for the goals.</p></div>
          <div class="sdg-card sdg-18"><span>+</span><h3>Cross-SDG Projects</h3><p>Projects linking many goals.</p></div>
        </div>

      </div>
    </section>
  `;
}