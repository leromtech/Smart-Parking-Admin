// clickOutside.js
export default {
    beforeMount(el, binding) {
      el.__vueClickOutside__ = function(event) {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event);
        }
      };
      document.addEventListener('click', el.__vueClickOutside__);
    },
    unmounted(el) {
      document.removeEventListener('click', el.__vueClickOutside__);
      el.__vueClickOutside__ = null;
    },
  };
  