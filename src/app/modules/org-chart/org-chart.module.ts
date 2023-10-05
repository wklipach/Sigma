import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgChartComponent } from './org-chart/org-chart.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [OrgChartComponent],
    exports: [
        OrgChartComponent
    ]
})
export class OrgChartModule { }
