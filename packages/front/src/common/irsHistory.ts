import { reactive, ref } from "@vue/reactivity";
import { computed, watch } from "@vue/runtime-core";
import { Irs } from "core";
import { toRaw } from "vue";

let instance: IrsHistory;

export class IrsHistory {
  history = reactive<Irs[]>([]);
  current = ref<number>(-1);

  get currentIrs() {
    return computed(() => {
      return this.history[this.current.value];
    });
  }

  private constructor() {
    watch(this.history, () => {
      localStorage.setItem("history", JSON.stringify(toRaw(this.history)));
    });
  }

  static getInstance(): IrsHistory {
    if (!instance) {
      instance = new IrsHistory();
    }
    return instance;
  }

  clear() {
    this.history.splice(0, this.history.length);
  }

  add(irs: Irs) {
    if (this.current.value > 0) {
      const from = this.current.value + 1;
      this.history.splice(from, this.history.length - from);
    }
    this.history.push(irs);
    this.current.value += 1;
  }

  back() {
    if (this.current.value > 0) {
      this.current.value--;
    }
  }

  forward() {
    if (this.current.value < this.history.length - 1) {
      this.current.value++;
    }
  }
}
