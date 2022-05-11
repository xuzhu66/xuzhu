<template lang="pug">
    svg-icon.but-loading(icon-class='loading' :class="isRepProp ? 'loading-rotate-auto-hid' : 'loading-rotate'")
</template>
<script>
export default {
    name: 'LoadingBut',
    props: {
        isRepProp: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    }
}
</script>

<style>
.but-loading {
    width: 18px !important;
    height: 18px !important;
}

.loading-rotate {
    animation: rotate 0.5s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
        transform-origin: center center;
    }
    to {
        transform: rotate(359deg);
        transform-origin: center center;
    }
}

.loading-rotate-auto-hid {
    transform: rotate(-360deg);
    transition: transform 1s ease-in-out;
}

</style>
