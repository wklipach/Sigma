import { Component, ElementRef, HostBinding } from "@angular/core";

@Component({
  selector: "th[resizable]",
  templateUrl: "./resizable.template.html",
  styleUrls: ["./resizable.style.less"],
})
export class ResizableComponent {
  @HostBinding("style.width.px")
  width: number | null = null;

  onResize(width: number) {
    this.width = width;
  }
}
