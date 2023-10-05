import { Component } from '@angular/core';
import {TreeNode} from   '../../../modules/org-chart/tree-node';

// make your own interface that extends TreeNode
interface MyTreeNode extends TreeNode {
    name: string;
    description?: string;
    image?: string;
    children: MyTreeNode[];
}

@Component({
  selector: 'app-drag-grop-staff3',
  templateUrl: './drag-grop-staff3.component.html',
  styleUrls: ['./drag-grop-staff3.component.scss']
})
export class DragGropStaff3Component {

  tree: MyTreeNode = {
    name: 'Felines',
    description: 'Cute playful animals',
    image: 'assets/chart-images/1.png',
    //onClick: () => alert('Death to dogs'),
    children: [
        {
            name: 'Big Cats',
            image: 'assets/chart-images/3.jpg',
            css: 'background-color: #F00000',
            children: [
                {
                    name: 'Lion',
                    image: 'assets/chart-images/6.png',
                    children: []
                },
                {
                    name: 'Tiger',
                    cssClass: 'yellow-on-hover',
                    image: 'assets/chart-images/4.jpg',
                    children: []
                },
                {
                    name: 'Cheetah',
                    image: 'assets/chart-images/8.png',
                    children: []
                }
            ]
        },
        {
            name: 'Small Cats',
            description: 'Cute, but can also be crude. Like when they defecate on your lap, that would be a good example of crudeness on their part',
            image: 'assets/chart-images/9.png',
            children: [
                {
                    name: 'House Cat',
                    image: 'assets/chart-images/7.png',
                    children: []
                },
                {
                    name: 'Street Cat',
                    image: 'assets/chart-images/8.png',
                    children: [
                        {
                            name: 'Dumb Cat',
                            image: 'assets/chart-images/13.png',
                            children: [
                                {
                                    name: 'Sorry For Bad Example',
                                    image: 'assets/chart-images/6.png',
                                    children: []
                                }
                            ],
                        },
                        {
                            name: 'Good Cat',
                            image: 'assets/chart-images/8.png',
                            children: [
                                {
                                    name: 'Binary Search Tree',
                                    image: 'assets/chart-images/10.png',
                                    children: [
                                        {
                                            name: '7',
                                            image: 'assets/chart-images/11.png',
                                            children: [
                                                {
                                                    name: '3',
                                                    image: 'assets/chart-images/6.png',
                                                    children: [
                                                        {
                                                            name: '2',
                                                            image: 'assets/chart-images/7.png',
                                                            children: []
                                                        },
                                                        {
                                                            name: '5',
                                                            image: 'assets/chart-images/12.png',
                                                            children: []
                                                        }
                                                    ]
                                                },
                                                {
                                                    name: '13',
                                                    description: 'An odd yet funny number.',
                                                    image: 'assets/chart-images/14.png',
                                                    children: [
                                                        {
                                                            name: '11',
                                                            description: 'All nodes to the right are greater',
                                                            image: 'assets/chart-images/15.png',
                                                            children: []
                                                        },
                                                        {
                                                            name: '17',
                                                            image: 'assets/chart-images/13.png',
                                                            description: 'This number is less that 17.00000001',
                                                            children: []
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            name: 'Fake Cats',
            image: 'assets/chart-images/5.png',
            children: [],
            //onClick: () => console.log('Google chrome stole some RAM')
        }
    ]
};



dragstart(event: any) {
  console.log(`starting`, event);
  // Hide dragged element
}

onDragEnd(event: any) {
  console.log('drag end', event);
  // Show dragged element again
}

onDragOver(event: any) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'link'; // ставим тип курсора
}

}
