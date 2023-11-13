
type Point = {
    x: number,
    y: number
}


export default function createHelperLine(p1: Point, p2: Point, p3: Point, p4: Point, strokeColor = "#2c96b6", strokeWidth = '1') {
    // 创建SVG路径字符串，包含两个线段
    const svgPath = `M${p1.x},${p1.y} L${p2.x},${p2.y} M${p3.x},${p3.y} L${p4.x},${p4.y}`;

    // 创建SVG元素
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100000");
    svg.setAttribute("height", "100000");
    svg.setAttribute("id", "path-svg");
    svg.setAttribute("viewBox", "-50000 -50000 100000 100000");


    svg.setAttribute("transform", "translate(-50000,-50000)");


    // 创建路径元素
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", svgPath);
    path.setAttribute("stroke", strokeColor);
    path.setAttribute("stroke-width", strokeWidth);
    path.setAttribute("fill", "none");

    // 将路径添加到SVG元素
    svg.appendChild(path);

    // 返回SVG元素
    return svg;
}

