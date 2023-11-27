import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { colormap } from '../colormap'; // Assuming colormap is correctly implemented

const LegendView = () => {
    const svgRef = useRef(null);
    const size = 250; // Size of the square

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const defs = svg.append("defs");

        // Create a gradient for the colormap
        const gradient = defs.append("linearGradient")
            .attr("id", "colormap-gradient")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "100%")
            .attr("y2", "0%");
        for (let i = 0; i <= 1; i += 0.01) {
            gradient.append('stop')
              .attr('offset', `${i * 100}%`)
              .attr('stop-color', colormap(1-i, 1-i));
        }

        const verticalGradient = defs.append('linearGradient')
            .attr('id', 'vertical-gradient')
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");
        for (let i = 0; i <= 1; i += 0.01) {
            verticalGradient.append('stop')
              .attr('offset', `${i * 100}%`)
              .attr('stop-color', colormap(1, i));
        }

        const horizontalGradient = defs.append('linearGradient')
            .attr('id', 'horizontal-gradient')
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");
        for (let i = 0; i <= 1; i += 0.01) {
            horizontalGradient.append('stop')
            .attr('offset', `${i * 100}%`)
            .attr('stop-color', colormap(1-i, 1));
        }


        // Draw the colormap square
        svg.append("rect")
            .attr("width", size)
            .attr("height", size)
            .style("fill", "url(#colormap-gradient)")

        svg.append("rect")
            .attr("width", size)
            .attr("height", size)
            .style("fill", "url(#vertical-gradient)")

                        // .style("fill", "url(#vertical-gradient)")
                        // .style("fill", "url(#horizontal-gradient)");


        // Add texts at the corners
        svg.append("text")
            .attr("x", 5)
            .attr("y", size - 5)
            .style("fill", "black")
            .text("No distortions");

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
            .attr("x", size - 60)
            .attr("y", 15)
            .style("fill", "white")
            .text("Both");

    }, []);

    return <svg ref={svgRef} width={size} height={size}></svg>;
};

export default LegendView;
