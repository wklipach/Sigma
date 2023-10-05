import { Component, Input, ViewEncapsulation, TemplateRef } from '@angular/core';
import { TreeNode } from '../tree-node';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'angular-org-chart',
    exportAs: 'orgChart',
    templateUrl: './org-chart.component.html',
    styleUrls: ['./org-chart.component.scss'],
    host: {
        '[class.ng13-org-chart-zoom-out]': 'zoomOut'
    },
    encapsulation: ViewEncapsulation.None
})
export class OrgChartComponent {

    @Input() data!: TreeNode;
    @Input() hasParent = false;
    @Input() nodeTemplate!: TemplateRef<any>;
    zoomOut = false;

    constructor() {
    }

    public onClick(){
        if (this.data && this.data.onClick) {
            this.data.onClick();
        }
    }

    public toggleZoom() {
        this.zoomOut = !this.zoomOut;
    }


}
