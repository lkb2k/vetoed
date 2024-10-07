<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-xl p-5 bg-white shadow-lg rounded">
      <!-- Add Participants Section -->
      <div v-if="stage === 'addParticipants'" class="space-y-4">
        <h1 class="text-2xl font-bold text-center">Add Participants</h1>
        <div class="flex items-center justify-center">
          <input v-model="newParticipant" @keyup.enter="addParticipant"
                 class="form-input block w-full px-4 py-2 border rounded-md" placeholder="Enter participant name">
          <button @click="addParticipant" class="ml-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded">
            Add
          </button>
        </div>
        <ul class="list-disc pl-10 space-y-2">
          <li v-for="participant in participants" :key="participant"
              class="px-3 py-2 rounded shadow-sm bg-gray-50">
            {{ participant }}
          </li>
        </ul>
        <button @click="startNominations" :disabled="participants.length === 0"
                class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Start Nominations
        </button>
      </div>

      <!-- Nominations Section -->
      <div v-else-if="stage === 'nominations'" class="space-y-4">
        <h1 class="text-2xl font-bold text-center">Nominations by {{ currentParticipant }}</h1>
        <div class="flex items-center justify-center">
          <input v-model="newNomination" @keyup.enter="submitNomination"
                 class="form-input block w-full px-4 py-2 border rounded-md" placeholder="Enter nomination">
          <button @click="submitNomination" class="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Submit
          </button>
        </div>
      </div>

      <!-- Veto Section -->
      <div v-else-if="stage === 'veto'" class="space-y-4">
        <h1 class="text-2xl font-bold text-center">Veto by {{ currentParticipant }}</h1>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(nomination, index) in nominations" :key="index"
               :class="{'shadow-lg': !nomination.vetoed, 'bg-gray-300 relative': nomination.vetoed}"
               class="p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
               @click="veto(index)">
            <div v-if="nomination.vetoed" class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-500">
              <font-awesome-icon :icon="['fas', 'skull']" class="text-6xl"/>
            </div>
            {{ nomination.name }}
          </div>
        </div>
      </div>
      
      <!-- Result Section -->
      <div v-else-if="stage === 'result'" class="space-y-4">
        <h1 class="text-2xl font-bold text-center">Winner</h1>
        <div class="p-3 bg-green-500 text-white rounded text-center">
          {{ winner }}
        </div>
      </div>
    </div>
  </div>
</template>



<script>
export default {
  data() {
    return {
      participants: [],
      nominations: [],
      participantIndex: 0,
      stage: 'addParticipants',
      newParticipant: '',
      newNomination: '',
      winner: ''
    };
  },
  computed: {
    currentParticipant() {
      return this.participants[this.participantIndex];
    }
  },
  methods: {
    addParticipant() {
      if (this.newParticipant.trim()) {
        this.participants.push(this.newParticipant.trim());
        this.newParticipant = '';
      }
    },
    startNominations() {
      this.stage = 'nominations';
    },
    submitNomination() {
      if (this.newNomination.trim()) {
        this.nominations.push({ name: this.newNomination.trim(), vetoed: false });
        this.newNomination = '';
        this.nextParticipant();
      }
    },
    veto(index) {
      this.nominations[index].vetoed = true;
      this.checkForWinner();
      this.nextParticipant();
    },
    nextParticipant() {
      this.participantIndex++;
      if (this.participantIndex >= this.participants.length) {
        if (this.stage === 'nominations') {
          this.participantIndex = 0;
          this.stage = 'veto';
        } else if (this.stage === 'veto') {
          this.participantIndex = 0;
          this.stage = 'result';
          this.winner = this.nominations.find(n => !n.vetoed).name;
        }
      }
    },
    checkForWinner() {
      const activeNominations = this.nominations.filter(n => !n.vetoed);
      if (activeNominations.length === 1) {
        this.winner = activeNominations[0].name;
        this.stage = 'result';
      }
    }
  }
};
</script>