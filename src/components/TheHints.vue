<template>
  <h1>Hints</h1>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6">
        <v-expansion-panels>
          <v-expansion-panel title="Live Grid" class="bg-surface">
            <v-expansion-panel-text>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th v-for="header in theLiveGridObject.headers">{{ header }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in theLiveGridObject.matrix">
                    <td v-for="entry in row" :data-in-bee="entry.actuallyInBee" :data-count-value="entry.val"
                      class="text-uppercase">
                      {{ entry.display }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col>
        <v-expansion-panels>
          <v-expansion-panel title="Live Two-Letter" class="bg-surface">
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-item v-for="obj in theLiveTwoLetterObject" class="text-uppercase">
                  {{ obj }}
                </v-list-item>
              </v-list>

            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import 'core-js/features/array/group.js'
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
    return props.twoLetter.map(row => row.split(" ")).flat().reduce((aggregate, current) => {
      const [twoLetter, count] = current.split('-')
      aggregate[twoLetter] = Number(count)
      return aggregate
    }, {})
  } else {
    return []
  }
})

const theLiveTwoLetterObject = computed(() => {
  const liveTwoLetterObject = { ...theCompleteTwoLetter.value }
  let finalArray = []
  for (const prop in props.foundWordsTwoLetter) {
    liveTwoLetterObject[prop] = liveTwoLetterObject[prop] - props.foundWordsTwoLetter[prop]
    finalArray.push(`${prop}: ${liveTwoLetterObject[prop]}`)
  }
  return finalArray
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

<style scoped></style>