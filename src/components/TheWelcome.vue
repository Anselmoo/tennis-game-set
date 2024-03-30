<script setup>
import WelcomeItem from './WelcomeItem.vue'
import TennisGroup from './icons/IconTennis.vue'
import ToolingGroup from './icons/IconGroup.vue'

import { ref, watch, computed } from 'vue'

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
  let playersPerTeam = isDoubles ? 2 : 1

  // Calculate the total number of players that can play
  let totalPlayers = numCourts * 2 * playersPerTeam

  // If the total number of players exceeds the number of available spots, remove the excess players
  if (shuffledPlayers.length > totalPlayers) {
    shuffledPlayers.length = totalPlayers
  }

  // Split the shuffled players into teams
  for (let i = 0; i < shuffledPlayers.length; i += playersPerTeam) {
    teams.value.push(shuffledPlayers.slice(i, i + playersPerTeam))
  }

  // Assign teams to courts and fields
  for (let i = 0; i < teams.value.length; i++) {
    let courtIndex = Math.floor(i / 2) % numCourts
    let field = i % 2 === 0 ? 'A' : 'B'
    if (!courts.value[courtIndex]) {
      courts.value[courtIndex] = { A: [], B: [] }
    }
    courts.value[courtIndex][field].push(teams.value[i])
  }

  // Sort teams by player
  let playerList = []
  courts.value.forEach((court, courtIndex) => {
    Object.entries(court).forEach(([field, teams]) => {
      teams.forEach((team) => {
        team.forEach((player) => {
          playerList.push({
            player,
            team: `${field}`,
            court: courtIndex + 1
          })
        })
      })
    })
  })
  sortedByPlayer.value = playerList.sort((a, b) => a.player.localeCompare(b.player)) // Update the value of sortedByPlayer
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
        <el-col v-for="(teams, field) in court" :key="field" :span="24">
          <el-icon><GoldMedal /></el-icon> Team {{ field }} <el-icon><DArrowLeft /></el-icon>
          <el-icon><Avatar /></el-icon>
          {{ teams.join(', ') }}
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
