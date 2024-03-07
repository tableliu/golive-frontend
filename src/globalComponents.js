/**
 * Vuely Global Components
 */
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import AppSectionLoader from "Components/AppSectionLoader/AppSectionLoader";
import { Circle8, RotateSquare2, SpinLine, Jumper, Circle7 } from "vue-loading-spinner";
// delete Confirmation Dialog
import DeleteConfirmationDialog from "Components/DeleteConfirmationDialog/DeleteConfirmationDialog";

// page title bar
import PageTitleBar from "Components/PageTitleBar/PageTitleBar";

// App Card component
import AppCard from 'Components/AppCard/AppCard';

// section tooltip
import SectionTooltip from "Components/SectionTooltip/SectionTooltip"

// message toast
import Message from 'Components/Toast/Message'

import Loading from 'Components/Loading/Loading'


const GlobalComponents = {
   install(Vue) {
      Vue.component('appCard', AppCard);
      Vue.component('sectionTooltip', SectionTooltip);
      Vue.component('deleteConfirmationDialog', DeleteConfirmationDialog);
      Vue.component('vuePerfectScrollbar', VuePerfectScrollbar);
      Vue.component('appSectionLoader', AppSectionLoader);
      Vue.component('pageTitleBar', PageTitleBar);
      Vue.component('rotateSquare2', RotateSquare2);
      Vue.component('Circle8', Circle8);
      Vue.component('SpinLine', SpinLine);
      Vue.component('Jumper', Jumper);
      Vue.component('Circle7', Circle7);
      Vue.component('message', Message);
      Vue.component('Loading', Loading);
   }
}

export default GlobalComponents
