<template>
  <h1>Hints</h1>
  <h2>Live Grid</h2>
  <table>
    <tr>
      <th v-for="header in theLiveGridObject.headers">{{ header }}</th>
    </tr>
    <tr v-for="row in theLiveGridObject.matrix">
      <td v-for="entry in row" :data-in-bee="entry.actuallyInBee" :data-count-value="entry.val">{{ entry.display }}</td>
    </tr>
  </table>
  <pre>
    {{ theLiveTwoLetterObject }}
  </pre>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps(
  {
    grid: Array,
    twoLetter: Array,
    foundWordsGrid: Object,
    foundWordsTwoLetter: Object
  }
);

const theCompleteTwoLetter = computed(() => {
  if (props.twoLetter.length > 0) {
    return props.twoLetter.map(row => {
      const firstLetter = row[0]
      const twoLetterObjectList = row.split(" ").map(item => {
        const itemArray = item.split("-")
        return { twoLettervalue: itemArray[0], count: Number(itemArray[1]) }
      })
      return { [firstLetter]: twoLetterObjectList }
    })
  } else {
    return []
  }
})

const theLiveTwoLetterObject = computed(() => {


  // {
  //   const remainingTwoLetter = props.foundWordsTwoLetter.reduce((aggregate, current) => {
  //     aggregate[]
  //   }, {})
  // }
  return theCompleteTwoLetter.value
})


const theCompleteGrid = computed(() => {
  if (props.grid.length > 0) {
    let [gridHeading, ...gridData] = props.grid
    gridHeading = gridHeading.split(",").slice(1, -1)
    const finalGridData = gridData.slice(0, -1).map(row => {
      let rowList = row.split(",").slice(0, -1)
      let [rowHeading, ...rowData] = rowList
      const firstLetter = rowHeading.slice(0, 1)
      return rowData.map((item, i) => {
        if (item === "-") {
          var count = { val: 0, display: "-", actuallyInBee: false }
        } else {
          var count = {
            actuallyInBee: true,
            display: Number(item),
            val: Number(item)
          }
        }
        return {
          wordLength: gridHeading?.[i],
          firstLetter,
          count
        }
      })
    })
    return finalGridData
  } else return []
});

const theLiveGridObject = computed(() => {
  if (Object.keys(props.foundWordsGrid).length < 1) {
    return "no found words"
  }
  const aggregatedGrid = theCompleteGrid.value.flat().reduce((aggregate, current) => {
    const { firstLetter, wordLength, count } = current
    const { actuallyInBee } = count
    const foundWordLengthCount = props.foundWordsGrid?.[firstLetter]?.[wordLength]?.count ?? 0
    let remaining, display
    if (actuallyInBee) {
      remaining, display = count.val - foundWordLengthCount
    } else {
      remaining = 0
      display = "-"
    }
    if (aggregate[firstLetter] == null) {
      aggregate[firstLetter] = { [wordLength]: { actuallyInBee, display, val: remaining } }
    } else {
      aggregate[firstLetter][wordLength] = { actuallyInBee, display, val: remaining }
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
      counts.push(letterObject[lengthProperty])
    }
    countMatrix.push([{ display: header }, ...counts])
  }
  return {
    headers: ['', ...columnHeaders],
    matrix: countMatrix
  }
});
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
  background-color: #DDD;
}

th,
tr>td:first-child {
  font-weight: bold;
}

td {
  padding: 3px;
  width: 3rem;
}

td[data-in-bee='false'] {
  color: #aaa;
}
</style>