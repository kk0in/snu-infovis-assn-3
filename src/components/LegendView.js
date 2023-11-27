import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { colormap } from '../colormap'; // Assuming colormap is correctly implemented

const LegendView = () => {
    const svgRef = useRef(null);
    const size = 250; // Size of the square

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                svg.append("rect")
                    .attr("x", size-i)
                    .attr("y", j)
                    .attr("width", 1)
                    .attr("height", 1)
                    .attr("fill", colormap(i / size, j / size));
            }
        }

        svg.append("text")
            .attr("x", 5)
            .attr("y", size - 5)
            .style("fill", "black")
            .text("No Distortions");

        svg.append("text")
            .attr("x", 5)
            .attr("y", 15)
            .style("fill", "white")
            .text("Missing Neighbors");

        svg.append("text")
            .attr("x", size - 120)
            .attr("y", size - 5)
            .style("fill", "white")
            .text("False Neighbors");

        svg.append("text")
            .attr("x", size - 40)
            .attr("y", 15)
            .style("fill", "white")
            .text("Both");

    }, []);

    return <svg ref={svgRef} width={size} height={size}></svg>;
};

export default LegendView;
