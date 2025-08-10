<template>
  <div class="mt-8 flex relative lg:mt-0 lg:py-2 lg:pr-0 lg:pl-[calc(var(--section-gap)/2)]">
    <i class="flex items-center justify-center w-8 h-8 text-slate-400 lg:absolute lg:top-[calc(50%-25px)] lg:left-[-26px] lg:w-12 lg:h-12 lg:border lg:border-slate-600 lg:bg-slate-800 lg:rounded-lg">
      <slot name="icon"></slot>
    </i>
    <div class="flex-1 ml-4">
      <h3 class="text-xl font-medium mb-2 text-slate-200">
        <slot name="heading"></slot>
      </h3>
      <div class="text-slate-300 leading-relaxed">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Timeline connector lines for desktop */
@media (min-width: 1024px) {
  .mt-8:before {
    content: ' ';
    border-left: 1px solid rgb(71 85 105); /* slate-600 */
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .mt-8:after {
    content: ' ';
    border-left: 1px solid rgb(71 85 105); /* slate-600 */
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .mt-8:first-of-type:before {
    display: none;
  }

  .mt-8:last-of-type:after {
    display: none;
  }
}
</style>
