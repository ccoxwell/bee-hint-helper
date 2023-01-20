<template>
  <h1>Hints</h1>
  <h2>Live Grid</h2>
  <ul>
    <li v-for="item in theLiveGrid">
      <ul>
        <li v-for="obj in item">{{ obj }}</li>
      </ul>
    </li>
  </ul>
  <h2>Complete Grid</h2>
  <ul>
    <li v-for="item in theCompleteGrid">
      <ul>
        <li v-for="obj in item">{{ obj }}</li>
      </ul>
    </li>
  </ul>
  <pre>
    {{ foundWords }}
  </pre>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(
  {
    grid: Array,
    twoLetter: Array,
    foundWords: Object
  });


const theCompleteGrid = computed(() => {
  if (props.grid.length > 0) {
    let [gridHeading, ...gridData] = props.grid
    gridHeading = gridHeading.split(",").slice(1)
    return gridData.map(row => {
      let rowList = row.replaceAll("-", "0").split(",")
      let [rowHeading, ...rowData] = rowList
      const firstLetter = rowHeading.slice(0, 1)
      return rowData.map((item, i) => ({
        wordLength: gridHeading?.[i],
        firstLetter,
        count: Number(item),
      }))
    })
  } else return []
});

const theLiveGrid = computed(() => {
  return theCompleteGrid.value
})

/*
{
  "gridHeading": " ,4,5,6,7,8,9,Σ",
  "rows": [
    {
      "rowHeading": "a:",
      "rowData": [
        "0",
        "1",
        "0",
        "0",
        "0",
        "0",
        "1"
      ]
    },
    {
      "rowHeading": "b:",
      "rowData": [
        "9",
        "2",
        "1",
        "1",
        "1",
        "0",
        "14"
      ]
    },
    {
      "rowHeading": "l:",
      "rowData": [
        "0",
        "1",
        "1",
        "0",
        "0",
        "0",
        "2"
      ]
    },
    {
      "rowHeading": "p:",
      "rowData": [
        "0",
        "0",
        "0",
        "1",
        "0",
        "1",
        "2"
      ]
    },
    {
      "rowHeading": "t:",
      "rowData": [
        "0",
        "2",
        "1",
        "0",
        "0",
        "0",
        "3"
      ]
    },
    {
      "rowHeading": "Σ:",
      "rowData": [
        "9",
        "6",
        "3",
        "2",
        "1",
        "1",
        "22"
      ]
    }
  ]
}
*/
</script>

<style scoped>

</style>