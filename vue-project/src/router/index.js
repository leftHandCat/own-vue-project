import Vue from 'vue';
import Router from 'vue-router';
import home from '../components/home/home';
import designer from '../components/designer/designer';
import taskmanger from '../components/taskManagement/taskmanger';
import node from '../components/node/node';

/*taskManger*/
import strategy from '../components/taskManagement/strponent/strategy';
import manger from '../components/taskManagement/mangerponent/manger';
import history from '../components/taskManagement/historyponent/history';

Vue.use(Router)

export default new Router({
  routes: [	
  	{
      path: '/',
      component: home
   	},{
      path: '/home',
      component: home
    },{
       path: '/designer',
      component: designer
    },{
      path: '/taskmanger/strategy',
      component: taskmanger,
      children: [
        {
          path: '/taskmanger/strategy',
          component: strategy
        },
        {
          path: '/taskmanger/manger',
          component: manger
        },
        {
          path: '/taskmanger/history',
          component: history
        }
      ]
    },{
       path: '/node',
       component: node
    }
    
  ]
})
