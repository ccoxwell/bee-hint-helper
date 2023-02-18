<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon>

      </v-app-bar-nav-icon>
      <v-app-bar-title text="Bee Helper"></v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <TheHints :grid="gridList" :two-letter="twoLetterList" :found-words-grid="foundWordGridAggregate"
          :found-words-two-letter="foundWordTwoLetterAggregate">
        </TheHints>
        <!-- <FoundWords :found-words="foundWords"></FoundWords> -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import TheHints from '@/components/TheHints.vue'
import FoundWords from '@/components/FoundWords.vue'
import { ref, computed } from 'vue'
import 'core-js/features/array/group.js'

const twoLetterList = ref([])
const gridList = ref([])
const foundWords = ref([])

fetchHints()
fetchFoundWords()

const foundWordObjectList = computed(() => foundWords.value.map(word => (
  { justWord: word, wordLength: word.length, firstLetter: word[0], twoLetter: word.slice(0, 2) }
)))

const foundWordGridAggregate = computed(() => {
  return foundWordObjectList.value.reduce((aggregate, key) => {
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

const foundWordTwoLetterAggregate = computed(() => {
  const foundWordsGroupedByTwoLetterObject = foundWordObjectList.value.group(word => word.twoLetter)
  const foundWordsTwoLetterCountsObject = {}
  for (const prop in foundWordsGroupedByTwoLetterObject) {
    const groupedWordsLength = foundWordsGroupedByTwoLetterObject[prop].length
    foundWordsTwoLetterCountsObject[prop] = groupedWordsLength
  }
  return foundWordsTwoLetterCountsObject
})

async function fetchHints() {
  const hintsResponse = await fetch('http://localhost:3001/hints')
  const hintsObj = await hintsResponse.json()
  twoLetterList.value = hintsObj.twoLetterData
  gridList.value = hintsObj.cellTextArray
}

async function fetchFoundWords() {
  const foundWordsResponse = await fetch('http://localhost:3001/current-words')
  const foundWordsArray = await foundWordsResponse.json()
  foundWords.value = foundWordsArray.foundWords
}

</script>


<style scoped></style>
