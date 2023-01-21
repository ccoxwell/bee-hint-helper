<template>
  <h1>Hints</h1>
  <h2>Live Grid</h2>
  <table>
    <tr>
      <th v-for="header in theLiveGridObject.headers">{{ header }}</th>
    </tr>
    <tr v-for="row in theLiveGridObject.matrix">
      <td v-for="entry in row">{{ entry }}</td>
    </tr>
  </table>
  <h2>Found Words</h2>
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

const theLiveGridObject = computed(() => {
  if (Object.keys(props.foundWords).length < 1) {
    return "no found words"
  }
  const aggregatedGrid = theCompleteGrid.value.flat().reduce((aggregate, current) => {
    const { firstLetter, wordLength, count } = current
    const foundWordLengthCount = props.foundWords?.[firstLetter]?.[wordLength]?.count ?? 0
    if (aggregate[firstLetter] == null) {
      aggregate[firstLetter] = { [wordLength]: { count: count - foundWordLengthCount } }
    } else {
      aggregate[firstLetter][wordLength] = { count: count - foundWordLengthCount }
    }
    return aggregate
  }, {})
  const rowHeaders = Object.keys(aggregatedGrid)
  const columnHeaders = Object.keys(aggregatedGrid[rowHeaders[0]])
  let countMatrix = []
  for (const header of rowHeaders) {
    const letterObject = aggregatedGrid[header]
    let counts = []
    for (const lengthProperty in letterObject) {
      counts.push(letterObject[lengthProperty].count || "-")
    }
    countMatrix.push([header, ...counts])
  }
  return { headers: ['', ...columnHeaders], matrix: countMatrix }
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
body {
  font-size: 16px;
}

table {
  text-align: left;
  border-collapse: collapse;
  text-transform: capitalize;
}

tr:nth-child(even) {
  background-color: lightgray;
}

th,
tr>td:first-child {
  font-weight: bold;
}

td {
  padding: 3px;
  width: 3rem;
}
</style>