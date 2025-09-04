<template>
  <div>
    <header class="site-header">
      <div id="site-header__logo">
        <img src="@/assets/icons/vite.svg" alt="Logo" />
      </div>
      <nav class="site-header__nav">
        <div id="site-header__nav-bg"></div>
        <RouterLink to="/home">Home</RouterLink>
        <RouterLink to="/periodict">Periodict</RouterLink>
        <RouterLink to="/aspectRatio">Other</RouterLink>
        <RouterLink to="/example">Example</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </header>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  // This is where you can add any setup logic that needs to run when the component is mounted
  console.log('Home component mounted')
})
</script>

<style scoped lang="scss">
.site-header {
  display: flex;
  align-items: center;
  position: fixed;
  padding: 0.3vh;
  top: 4vh;
  left: 0;
  right: 0;
  z-index: 9999;
  #site-header__logo img {
    margin-left: 3vw;
    margin-right: 3vw;
  }
}
.site-header__nav {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.4vw;
  height: 60px;
  margin-right: 3vw;
  // color: black;
  color: rgba(186, 215, 245, 1);

  #site-header__nav-bg {
    position: absolute;
    inset: 0;
    z-index: -1;
    transform: translateZ(0);
    border-radius: calc(2rem + 15px);
    height: 100%;
    width: 100%;
    &:before {
      content: '';
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(5px);
      position: absolute;
      box-sizing: content-box;
      mask-clip: content-box;
      height: 100%;
      width: 100%;
      inset: -2rem 2rem 2rem -2rem;
      padding: 2rem;
      overflow: hidden;
      mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=);
      border-radius: calc(2rem + 15px);
    }
    &:after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 18px;
      border: 1px solid rgba(211, 211, 211, 0.03);
      background: linear-gradient(180deg, #def4ff0a, #abbcc50d, #5d676d1a);
    }
  }
}

.site-header {
  a {
    text-decoration: none;
    padding: 10px;
    &:hover {
      color: skyblue;
    }
  }
}
</style>
