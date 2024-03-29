<script setup>
import WelcomeItem from './WelcomeItem.vue'
import TennisGroup from './icons/IconTennis.vue'
import ToolingGroup from './icons/IconGroup.vue'

import { ref, watch } from 'vue'

let numPlayers = ref(2)
let numCourts = ref(1)
let isDoubles = ref(true)
let teams = ref([])
let courts = ref([])
let sortedByPlayer = ref([]) // Add this line
let displayOption = ref('court') // Add this line

watch([numPlayers, numCourts, isDoubles, displayOption], () => {
  generateTeams(numPlayers.value, numCourts.value, isDoubles.value)
})

const generateTeams = (numPlayers, numCourts, isDoubles) => {
  // Reset teams and courts
  teams.value = []
  courts.value = []

  // Create an array of players
  let players = Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`)

  // Shuffle the players array
  let shuffledPlayers = [...players]
  shuffledPlayers.sort(() => Math.random() - 0.5)

  // Calculate the number of players per team
  let playersPerTeam = isDoubles ? 4 : 2

  // Calculate the total number of players that can play
  let totalPlayers = numCourts * playersPerTeam

  // If the total number of players exceeds the number of available spots, remove the excess players
  if (shuffledPlayers.length > totalPlayers) {
    shuffledPlayers.length = totalPlayers
  }

  // Split the shuffled players into teams
  for (let i = 0; i < shuffledPlayers.length; i += playersPerTeam) {
    teams.value.push(shuffledPlayers.slice(i, i + playersPerTeam))
  }

  // Assign teams to courts
  for (let i = 0; i < teams.value.length; i++) {
    let courtIndex = i % numCourts
    if (!courts.value[courtIndex]) {
      courts.value[courtIndex] = []
    }
    courts.value[courtIndex].push(teams.value[i])
  }

  // Create the sortedByPlayer array
  sortedByPlayer.value = []
  for (let i = 0; i < teams.value.length; i++) {
    for (let j = 0; j < teams.value[i].length; j++) {
      sortedByPlayer.value.push({
        player: teams.value[i][j],
        team: i + 1,
        court: Math.floor(i / (isDoubles ? 4 : 2)) + 1
      })
    }
  }

  // Sort the sortedByPlayer array
  sortedByPlayer.value.sort((a, b) => a.player.localeCompare(b.player))
}
</script>

<template>
  <WelcomeItem>
    <template #icon>
      <ToolingGroup />
    </template>
    <template #heading>Set the Game</template>

    <el-form>
      <el-row>
        <el-col :span="8">
          <el-form-item label="Number of players:" class="vue-form-item"></el-form-item>
          <el-form-item label="Number of courts:" class="vue-form-item"></el-form-item>
          <el-form-item label="Doubles:" class="vue-form-item"></el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item>
            <el-input-number v-model="numPlayers" :min="2" class="vue-input"></el-input-number>
          </el-form-item>

          <el-form-item>
            <el-input-number v-model="numCourts" :min="1" class="vue-input"></el-input-number>
          </el-form-item>

          <el-form-item>
            <el-checkbox v-model="isDoubles" class="vue-checkbox"></el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="generateTeams(numPlayers, numCourts, isDoubles)"
              class="vue-button"
              ><el-icon><Refresh /></el-icon> Regenerate</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </WelcomeItem>

  <WelcomeItem>
    <template #icon>
      <TennisGroup />
    </template>
    <template #heading>Get the Teams</template>

    <el-form>
      <el-row>
        <el-col :span="8">
          <el-form-item label="Display option:" class="vue-form-item"></el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item>
            <el-radio-group v-model="displayOption">
              <el-radio label="court">Court</el-radio>
              <el-radio label="player">Player</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider border-style="dotted" />
    <div v-if="displayOption === 'court'">
      <el-row v-for="(court, index) in courts" :key="index" class="box-card">
        <el-col :span="24" class="header">
          <span
            ><el-icon><Place /></el-icon> Court {{ index + 1 }}</span
          >
        </el-col>
        <el-col v-for="(team, teamIndex) in court" :key="teamIndex" :span="24">
          <el-icon><GoldMedal /></el-icon> Team {{ teamIndex + 1 }}: <el-icon><Avatar /></el-icon>
          {{ team.join(', ') }}
        </el-col>
      </el-row>
    </div>

    <div v-if="displayOption === 'player'">
      <el-row v-for="(item, index) in sortedByPlayer" :key="index" class="box-card">
        <el-col :span="24" class="header">
          <span
            ><el-icon><Avatar /></el-icon> {{ item.player }}</span
          >
        </el-col>
        <el-col :span="24">
          <el-icon><GoldMedal /></el-icon> Team {{ item.team }} <el-icon><DArrowRight /></el-icon>
          <el-icon><Place /></el-icon> Court {{ item.court }}
        </el-col>
      </el-row>
    </div>

    <el-icon name="el-icon-arrow-right"></el-icon>
  </WelcomeItem>
</template>

<style src="../assets/main.css"></style>
