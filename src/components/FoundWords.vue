<template>

    <ul>
        <li v-for="word in foundWords">
            {{ word }}
        </li>
    </ul>
</template>

<script setup>
const props = defineProps({
    foundWords: Array,
});
</script>