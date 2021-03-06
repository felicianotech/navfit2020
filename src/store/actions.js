export default {
  loadApp() {
    window.ipcRenderer.send("app:load");
  },
  loadDb({ commit }) {
    window.ipcRenderer.send("db:load");
    window.ipcRenderer.on("db:loaded", (event, args) => {
      if (args.commandInfo) {
        commit("SET_COMMAND", args.commandInfo);
      }
      commit("SET_SAILORS", args.sailors);
    });
  },
  addSailor({ commit, dispatch }) {
    const form = this.getters.getSailorEditForm;
    window.ipcRenderer.send("db:add:sailor", form);
    window.ipcRenderer.on("db:add:sailor:result", (_, args) => {
      if (args.error) {
        commit("setError");
        commit("setErrorMsg", args.error.toString());
        commit("setErrorObj", args);
      }
      dispatch("loadDb").then(() => {
        dispatch("setSelectedSailor", args.uuid);
      });
    });
  },
  updateSailor({ commit, dispatch }) {
    const form = this.getters.getSailorEditForm;
    window.ipcRenderer.send("db:update:sailor", form);
    window.ipcRenderer.on("db:update:sailor:result", (_, args) => {
      if (args.error) {
        commit("setError");
        commit("setErrorMsg", args.error.toString());
        commit("setErrorObj", args);
      }
      dispatch("loadDb");
    });
  },
  deleteSailor({ commit, dispatch }, payload) {
    window.ipcRenderer.send("db:delete:sailor", payload);
    window.ipcRenderer.on("db:delete:sailor:result", (_, args) => {
      if (args.error) {
        commit("setError");
        commit("setErrorMsg", args.error.toString());
        commit("setErrorObj", args);
      }
      dispatch("loadDb");
    });
  },
  addEval({ commit, dispatch }) {
    const { uuid } = this.getters.getSelectedSailor;
    const form = {
      ...this.getters.getEvalEditForm,
      command: { ...this.getters.getCommandInfo },
    };

    window.ipcRenderer.send("db:add:record", { uuid, form });
    window.ipcRenderer.on("db:add:record:result", (_, args) => {
      if (args.error) {
        commit("setError");
        commit("setErrorMsg", args.error.toString());
        commit("setErrorObj", args);
      } else {
        dispatch("clearEvalEditForm");
        dispatch("loadDb");
      }
    });
  },
  updateEval({ commit, dispatch }) {
    const form = this.getters.getEvalEditForm;
    const { uuid } = this.getters.getSelectedSailor;

    window.ipcRenderer.send("db:update:record", { uuid, form });
    window.ipcRenderer.on("db:update:record:result", (_, args) => {
      if (args.error) {
        commit("setError");
        commit("setErrorMsg", args.error.toString());
        commit("setErrorObj", args);
      } else {
        dispatch("clearEvalEditForm");
        dispatch("loadDb");
      }
    });
  },
  saveCommandDefaults({ commit, dispatch }) {
    const form = this.getters.getCommandEditForm;
    window.ipcRenderer.send("db:add:commandDefaults", form);
    window.ipcRenderer.on("db:add:commandDefaults:result", (_, args) => {
      if (args.error) {
        commit("setError");
        commit("setErrorMsg", args.error.toString());
        commit("setErrorObj", args);
      }
      dispatch("loadDb");
    });
  },
  setCommandEditForm({ commit }, payload) {
    commit("SET_COMMAND_EDIT_FORM", payload);
  },
  updateCommandEditForm({ commit }, payload) {
    commit("UPDATE_COMMAND_EDIT_FORM", payload);
  },
  clearCommandEditForm({ commit }) {
    commit("CLEAR_COMMAND_EDIT_FORM");
  },
  setSelectedSailor({ commit }, uuid) {
    const sailorData = this.getters.getSailorById(uuid);
    commit("SET_SELECTED_SAILOR", sailorData);
    commit("SET_SAILOR_EDIT_FORM", sailorData);
  },
  setSailorEditForm({ commit }, payload) {
    commit("SET_SAILOR_EDIT_FORM", payload);
  },
  updateSailorEditForm({ commit }, payload) {
    commit("UPDATE_SAILOR_EDIT_FORM", payload);
  },
  clearSailorEditForm({ commit }) {
    commit("CLEAR_SAILOR_EDIT_FORM");
  },
  setEvalEditForm({ commit }, payload) {
    commit("SET_EVAL_EDIT_FORM", payload);
  },
  updateEvalEditForm({ commit }, payload) {
    commit("UPDATE_EVAL_EDIT_FORM", payload);
  },
  clearEvalEditForm({ commit }) {
    commit("CLEAR_EVAL_EDIT_FORM");
  },
  exportEval({ commit }, payload) {
    const sailor = this.getters.getSelectedSailor;
    window.ipcRenderer.send("pdf:export", { sailor, id: payload });
    window.ipcRenderer.on("dialog:show", (event, args) => {
      commit("SET_DIALOG_INFO", args);
      commit("SHOW_DIALOG");
    });
  },
  dismissDialog({ commit }) {
    commit("DISMISS_DIALOG");
  },
  openFeedbackForm() {
    window.ipcRenderer.send("open:feedback");
  },
  openGithubRepo() {
    window.ipcRenderer.send("open:githubRepo");
  }
};
