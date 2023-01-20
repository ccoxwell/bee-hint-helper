<template>

    <ul>
        <li v-for="word in currentWords">
            {{ word }}
        </li>
    </ul>
</template>

<script setup>
const props = defineProps({
    currentWords: Array,
});
</script>