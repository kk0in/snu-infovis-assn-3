import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { tnc } from '../tnc'; // Import tnc function
import { colormap } from '../colormap'; // Import colormap function
import { Delaunay } from 'd3-delaunay';

const ProjectionView = (props) => {
    const [enableCheckViz, setEnableCheckViz] = useState(false);
    const svgRef = useRef(null);

    let data = props.data;
    let axes = props.axes;  

    useEffect(() => {
        // svg.selectAll("*").remove(); // Clear previous visualization

        // Calculate positions of each data point
        console.log(axes);
        console.log(data);
        const points = data.map(d => {
            let dx = 0, dy = 0;
            axes.forEach((axis, index) => {
                dx += axis.x * d[index]; // ax * da
                dy += axis.y * d[index]; // ay * da
            });
            return { x: dx, y: dy };
        });
        console.log(points);

        const xScale = d3.scaleLinear()
                        .domain(d3.extent(points, d => d.x))
                        .range([props.margin, props.width - props.margin]);
        const yScale = d3.scaleLinear()
                        .domain(d3.extent(points, d => d.y))
                        .range([props.height - props.margin, props.margin]);

        const svg = d3.select(svgRef.current);
        // Draw data points as circles
        svg.selectAll("circle")
            .data(points)
            .enter()
            .append("circle")
            .attr("cx", xScale(d => d.x))
            .attr("cy", yScale(d => d.y))
            .attr("r", 3)
            .style("fill", "white")
            .style("stroke", "black");

        if (enableCheckViz) {
            // Implement CheckViz Visualization
            const tncValues = tnc(data, points); // Calculate Trustworthiness/Continuity
            const colors = points.map((_, i) => colormap(tncValues.trust[i], tncValues.conti[i]));

            const delaunay = Delaunay.from(points.map(d => [d.x, d.y]));
            const voronoi = delaunay.voronoi([0, 0, 500, 500]); // Define bounds for Voronoi diagram

            svg.selectAll("path")
                .data(points)
                .enter()
                .append("path")
                .attr("d", (_, i) => voronoi.renderCell(i))
                .attr("fill", (_, i) => colors[i])
                .attr("stroke", "none");
        }

    }, [data, axes, enableCheckViz]);

    const toggleCheckViz = () => {
        setEnableCheckViz(!enableCheckViz);
    };

    return (
        <div>
            <svg ref={svgRef} width={500} height={500}></svg>
            <button onClick={toggleCheckViz}>
                {enableCheckViz ? 'Disable CheckViz' : 'Enable CheckViz'}
            </button>
        </div>
    );
};

export default ProjectionView;
