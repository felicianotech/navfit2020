<template>
  <v-navigation-drawer v-model="drawer"
                       app
                       left
                       width="auto"
                       class="pa-2">
    <v-list>
      <v-list-item v-for="(sailor, uuid) in sailors"
                   :key="uuid"
                   class="pointer"
                   @click="viewSailorDetail(sailor.uuid)">
        <v-list-item-content>
          <v-list-item-title class="d-flex flex-nowrap">
            {{ sailor.name }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon
                 small
                 @click.stop="deleteSailor(sailor.uuid)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <TheDeleteSailorDialogComponent v-model="showDeleteSailorDialog"
                                    :uuid="uuid" />
  </v-navigation-drawer>
</template>

<script>
import Vue from "vue";
import TheDeleteSailorDialogComponent from "./TheDeleteSailorDialogComponent";

export default Vue.extend({
  name: "TheNavigationDrawerComponent",
  components: {
    TheDeleteSailorDialogComponent,
  },
  props: {
    value: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data: () => ({
    showDeleteSailorDialog: false,
    uuid: null,
    search: null,
  }),
  computed: {
    drawer: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
    sailors() {
      return this.$store.getters.getSailorsSummaryList;
    },
  },
  methods: {
    viewSailorDetail(givenUuid) {
      this.$store.dispatch("setSelectedSailor", givenUuid)
        .then(() => this.$router.push({ name: "detail", params: { uuid: givenUuid } }))
        .catch(() => {
          this.drawer = !this.drawer;
        });
      // this.$router.push({ name: "detail", params: { uuid: givenUuid } }).catch(() => {});
    },
    deleteSailor(givenUuid) {
      this.uuid = givenUuid;
      this.showDeleteSailorDialog = !this.showDeleteSailorDialog;
    },
  },
});
</script>

<style lang="sass">
  .pointer
    cursor: pointer
</style>
