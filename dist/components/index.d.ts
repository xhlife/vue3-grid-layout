import GridItem from "./Grid/GridItem.vue";
import GridLayout from "./Grid/GridLayout.vue";
import { App } from "vue";
export { GridItem, GridLayout };
declare const Vue3GridLayout: {
    install(App: App<any>): void;
};
export default Vue3GridLayout;
