<template>
  <main>
    <TheHints :grid="gridList" :two-letter="twoLetterList" :found-words-grid="currentWordGridAggregate"
      :found-words-two-letter="currentWordTwoLetterAggregate">
    </TheHints>
    <FoundWords :current-words="currentWords"></FoundWords>
  </main>
</template>

<script setup>
import TheHints from '@/components/TheHints.vue'
import FoundWords from '@/components/FoundWords.vue'
import { ref, computed } from 'vue'

const twoLetterList = ref([])
const gridList = ref([])
const currentWords = ref([])

fetchHints()
fetchCurrentWords()

const currentWordObjectList = computed(() => currentWords.value.map(word => (
  { justWord: word, wordLength: word.length, firstLetter: word[0], twoLetter: word.slice(0, 2) }
)))

// create obj of same shape for complete grid
const currentWordGridAggregate = computed(() => {
  return currentWordObjectList.value.reduce((aggregate, key) => {
    const { firstLetter, wordLength } = key
    if (aggregate[firstLetter] == null) {
      aggregate[firstLetter] = { [wordLength]: { count: 1 } }
    } else if (aggregate[firstLetter][wordLength] == null) {
      aggregate[firstLetter][wordLength] = { count: 1 }
    } else {
      aggregate[firstLetter][wordLength].count++
    }
    return aggregate
  }, {})
})

const currentWordTwoLetterAggregate = computed(() => {
  return currentWordObjectList.value.reduce((aggregate, key) => {
    const { twoLetter, firstLetter } = key
    if (aggregate[firstLetter] == null) {
      aggregate[firstLetter] = { [twoLetter]: 1 }
    }
    else if (aggregate[firstLetter][twoLetter] == null) {
      aggregate[firstLetter][twoLetter] = 1
    } else {
      aggregate[firstLetter][twoLetter]++
    }
    return aggregate
  }, {})
})

async function fetchHints() {
  const hintsResponse = await fetch('http://localhost:3001/hints')
  const hintsObj = await hintsResponse.json()
  twoLetterList.value = hintsObj.twoLetterData
  gridList.value = hintsObj.cellTextArray
}

async function fetchCurrentWords() {
  const currentWordsResponse = await fetch('http://localhost:3001/current-words')
  const currentWordsArray = await currentWordsResponse.json()
  console.log(currentWordsArray)
  currentWords.value = currentWordsArray.foundWords
}

</script>


<style scoped>

</style>
