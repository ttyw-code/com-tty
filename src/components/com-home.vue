<template name="com-home">
  <nav class="navbar">
    <a href="#" class="nav-cta-btn">Get Started</a>
  </nav>
  <div class="section">
    <div class="video-visual">
      <video
        class="video"
        autoplay
        loop
        muted
        poster=""
        role="none"
        aria-label="background gradient animation"
      >
        <source
          src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/bg-gradient-animation.mp4"
          type="video/mp4"
        />
      </video>
    </div>
    <div class="section-wrapper">
      <div class="content-wrapper">
        <div class="content content-1">
          <div class="mobile-visual">
            <img
              class="card-img"
              src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/img-1.avif"
              alt="Fantasy warrior  - Video game character"
            />
          </div>
          <div class="meta">
            <h2 class="headline">
              Unleash Your
              <span class="text-highlight">Inner Warrior</span>
            </h2>
            <p class="desc">
              Join the battle and conquer the arena with unmatched skill and
              strategy.
            </p>
          </div>
        </div>
        <div class="content content-2">
          <div class="mobile-visual">
            <img
              class="card-img"
              src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/img-2.avif"
              alt="Green haired ninja in armor - Video game character"
            />
          </div>
          <div class="meta">
            <h2 class="headline">
              Embark on Your
              <span class="text-highlight">Legendary Journey</span>
            </h2>
            <p class="desc">
              Immerse Yourself in a World Where Legends Clash and Heroes Rise to
              Glory.
            </p>
          </div>
        </div>
        <div class="content content-3">
          <div class="mobile-visual">
            <img
              class="card-img"
              src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/img-3.avif"
              alt="Female warrior in armor - Video game character"
            />
          </div>
          <div class="meta">
            <h2 class="headline">
              Master the
              <span class="text-highlight">Art of Magic</span>
            </h2>
            <p class="desc">
              Harness powerful spells and enchantments to dominate your foes and
              change the course of battle.
            </p>
          </div>
        </div>
        <div class="content content-4">
          <div class="mobile-visual">
            <img
              class="card-img"
              src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/img-4.avif"
              alt="Agile warrior - Video game character"
            />
          </div>
          <div class="meta">
            <h2 class="headline">
              Rise as the
              <span class="text-highlight">Champion</span>
            </h2>
            <p class="desc">
              Lead your team to victory with unparalleled strength and
              unwavering determination.
            </p>
          </div>
        </div>
      </div>
      <div class="visual">
        <div class="card-wrapper">
          <div class="card card-1">
            <img
              class="card-img"
              src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/img-1.avif"
              alt="Fantasy warrior  - Video game character"
            />
          </div>
          <div class="card card-2">
            <img
              class="card-img"
              src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/img-2.avif"
              alt="Green haired ninja in armor - Video game character"
            />
          </div>
          <div class="card card-3">
            <img
              class="card-img"
              src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/img-3.avif"
              alt="Female warrior in armor - Video game character"
            />
          </div>
          <div class="card card-4">
            <img
              class="card-img"
              src="https://raw.githubusercontent.com/mobalti/open-props-interfaces/main/dynamic-content-lockups-v2/assets/img-4.avif"
              alt="Agile warrior - Video game character"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
for (const element of [1, 5, 9]) {
  console.log(element)
}
</script>

<style scoped lang="scss">
@layer library, reset, base, demo;
@import 'https://unpkg.com/open-props@2.0.0-beta.5' layer(library);
@import 'https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap';

@layer reset {
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  :where(:not(dialog)) {
    margin: 0;
  }
}

@layer base {
  html {
    --nav-block-size: 74px;
    --brand-gradient: linear-gradient(227deg, #1400c7 0%, #0bf 100%);

    @media (prefers-reduced-motion: no-preference) {
      scroll-behavior: smooth;
    }
  }

  body {
    min-block-size: 100dvb;
    font-family: Inter, sans-serif;
  }
}

@layer demo {
  .navbar {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
    z-index: var(--layer-3);
    display: grid;
    place-items: center end;
    min-block-size: var(--nav-block-size);
    padding-block: var(--size-3);
    padding-inline: var(--size-5);
    background-color: white;

    @media (width >=600px) {
      padding-inline: 6dvi;
    }
  }

  .nav-cta-btn {
    position: relative;
    inline-size: max-content;
    padding-block: var(--size-3);
    padding-inline: var(--size-7);
    overflow: hidden;
    font-size: var(--font-size-1);
    font-weight: var(--font-weight-7);
    color: black;
    text-decoration: none;
    white-space: nowrap;
    background:
      linear-gradient(white, white) padding-box,
      var(--brand-gradient) border-box;
    isolation: isolate;
    border: var(--border-size-2) solid transparent;
    border-radius: var(--radius-6);

    &::before {
      position: absolute;
      inset: 0;
      display: block;
      content: '';
      background: var(--brand-gradient);
      mix-blend-mode: screen;
    }

    &:hover {
      color: white;

      &::before {
        z-index: -1;
        background:
          var(--brand-gradient) padding-box,
          var(--brand-gradient) border-box;
        background-repeat: no-repeat;
        background-size: contain;
        mix-blend-mode: normal;
      }
    }
  }

  .section {
    --section-block-size: max(400px, 100dvb);

    position: relative;
    display: grid;
    block-size: 100%;
    min-block-size: var(--section-block-size);
    background-color: white;

    > * {
      grid-area: 1/1;
    }
  }

  .section-wrapper {
    position: relative;
    display: grid;

    @media (width >=960px) {
      grid-template-columns: 1fr 1fr;
    }

    @media (width < 960px) {
      padding-block: calc(var(--nav-block-size) + var(--size-7)) var(--size-7);
    }
  }

  .video {
    position: relative;
    z-index: -1;
    display: block;
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }

  .content-wrapper {
    display: grid;

    @media (width < 960px) {
      gap: var(--size-7);
    }
  }

  .meta {
    display: grid;
    gap: var(--size-3);
  }

  .content {
    display: grid;
    place-items: center;
    inline-size: 100%;
    padding-block: var(--size-7);
    padding-inline: var(--size-5);

    @media (width >=960px) {
      place-items: center end;
      min-block-size: 100cqb;
      padding: var(--size-10);
    }

    @media (width < 960px) {
      gap: var(--size-5);
    }
  }

  .mobile-visual {
    inline-size: 100%;
    aspect-ratio: var(--ratio-square);

    @media (width >=960px) {
      display: none;
    }
  }

  .headline {
    max-inline-size: var(--size-content-1);
    font-size: var(--font-size-7);
    font-weight: var(--font-weight-4);
    text-wrap: pretty;

    @media (width < 960px) {
      font-size: var(--font-size-6);
    }
  }

  .desc {
    max-inline-size: 40ch;
    font-size: var(--font-size-4);
    line-height: 1.5;
    text-wrap: pretty;

    @media (width < 960px) {
      font-size: var(--font-size-3);
    }
  }

  .visual {
    position: sticky;
    inset-block-start: 0;
    display: grid;
    block-size: var(--section-block-size);
    container-type: size;

    @media (width < 960px) {
      display: none;
    }
  }

  .video-visual {
    position: sticky;
    inset-block-start: 0;
    display: block;
    inline-size: 100%;
    block-size: var(--section-block-size);
    filter: hue-rotate(210deg);
    isolation: isolate;
  }

  .card-wrapper {
    container-type: size;
    display: grid;
    place-items: center;
    overflow: clip;

    > * {
      grid-area: 1/1;
    }
  }

  .card {
    inline-size: 70cqi;
    aspect-ratio: var(--ratio-square);
    border-radius: var(--radius-3);
    scale: 0.4;
  }

  .card-img {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }

  .card-1 {
    scale: 1;
  }

  .card-2 {
    opacity: 0.3;
    translate: -35cqi 30cqb;
  }

  .card-3 {
    opacity: 0.5;
    translate: 0 50cqb;
  }

  .card-4 {
    opacity: 0.5;
    translate: 45cqi 40cqb;
  }

  .content-1 {
    --_text-gradient: linear-gradient(227deg, #1400c7 0%, #0bf 100%);
  }

  .content-2 {
    --_text-gradient: linear-gradient(227deg, #28dc28 0%, #0bf 100%);
  }

  .content-3 {
    --_text-gradient: linear-gradient(227deg, #1400c7 0%, #b800b1 100%);
  }

  .content-4 {
    --_text-gradient: linear-gradient(227deg, #b800b1 0%, #f50000 100%);
  }

  .text-highlight {
    background: var(--_text-gradient);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
}

@supports (animation-timeline: scroll()) {
  body {
    timeline-scope: --content-1, --content-2, --content-3, --content-4;
  }

  .section {
    view-timeline-name: --section;
  }

  .content-1 {
    view-timeline-name: --content-1;
  }

  .content-2 {
    view-timeline-name: --content-2;
  }

  .content-3 {
    view-timeline-name: --content-3;
  }

  .content-4 {
    view-timeline-name: --content-4;
  }

  .card {
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  .card-1 {
    animation-timeline: --content-1;
    animation-name: slide-up-first-card;
  }

  .card-2 {
    animation-timeline: --content-2;
    animation-name: slide-up-card;
  }

  .card-3 {
    animation-timeline: --content-3;
    animation-name: slide-up-card;
  }

  .card-4 {
    animation-timeline: --content-4;
    animation-name: slide-up-card;
  }

  .video-visual {
    animation-timeline: --section;
    animation-range-end: exit 110%;
    animation-name: update-hue;
    animation-timing-function: step-end;
    animation-fill-mode: forwards;
  }

  @keyframes update-hue {
    0% {
      filter: hue-rotate(210deg);
    }

    25% {
      filter: hue-rotate(150deg);
    }

    45% {
      filter: hue-rotate(300deg);
    }

    60% {
      filter: hue-rotate(4deg);
    }
  }

  @keyframes slide-up-first-card {
    50% {
      opacity: 1;
      translate: 0;
    }

    90% {
      scale: 0.6;
      translate: 0 -50cqi;
    }

    100% {
      opacity: 0;
      translate: 0 -100cqi;
    }
  }

  @keyframes slide-up-card {
    50% {
      opacity: 1;
      scale: 1;
      translate: 0;
    }

    90% {
      opacity: 0.5;
      scale: 0.6;
      translate: 0 -50cqb;
    }

    100% {
      opacity: 0;
      translate: 0 -100cqi;
    }
  }
}
</style>
