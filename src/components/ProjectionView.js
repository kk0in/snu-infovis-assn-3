import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { tnc } from '../tnc'; // Import tnc function
import { colormap } from '../colormap'; // Import colormap function
import { Delaunay } from 'd3-delaunay';


const ProjectionView = (props) => {


    const { data, axes, width, height, margin, enableCheckViz, setEnableCheckViz } = props;
    const svgRef = useRef(null);

    const points = data.map(d => {
        let dx = 0, dy = 0;
        axes.forEach((axis, index) => {
            dx += axis.x * d[index]; // ax * da
            dy += axis.y * d[index]; // ay * da
        });
        return { dx, dy };
    });

    useEffect(() => {
        // Calculate positions of each data point



        const xScale = d3.scaleLinear()
                        .domain(d3.extent(points, d => d.dx))
                        .range([margin, width - margin]);
        const yScale = d3.scaleLinear()
                        .domain(d3.extent(points, d => d.dy))
                        .range([margin, height - margin]);

        const svg = d3.select(svgRef.current);
        svg.selectAll("circle").remove(); // Clear previous visualization

        // Draw data points as circles
        svg.append("g" )
            //.attr("transform", `translate(${margin}, ${margin})`)
            .selectAll("circle")
            .data(points)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.dx))
            .attr("cy", d => yScale(d.dy))
            .attr("r", 1.5)
            .style("fill", "white")
            .style("stroke", "black")
            // .attr("class", "data-point1");

        if (enableCheckViz) {
            // Implement CheckViz Visualization
            const projectedPoints2D = points.map(point => [point.dx, point.dy]);

            const { trust, conti } = tnc(data, projectedPoints2D);
            const colors = points.map((_, i) => {
                const color = d3.color(colormap(trust[i], conti[i]));
                return color;
            });

            const delaunay = Delaunay.from(points.map(d => [xScale(d.dx), yScale(d.dy)]));
            const voronoi = delaunay.voronoi([0, 0, width, height]); // Define bounds for Voronoi diagram

            svg.append('g')
                .selectAll("path")
                .data(points.map((_, i) => voronoi.renderCell(i)))
                .enter()
                .append("path")
                .attr("d", d => d)
                .attr("fill", (_, i) => colors[i])
                .attr("stroke", "none")
                .attr("class", "voronoi");
            
            svg.append("g" )
                //.attr("transform", `translate(${margin}, ${margin})`)
                .selectAll("circle")
                .data(points)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d.dx))
                .attr("cy", d => yScale(d.dy))
                .attr("r", 1.5)
                .style("fill", "white")
                .style("stroke", "black")
                // .attr("class", "data-point2");
        }
        else {
            svg.selectAll(".voronoi").remove(); // Clear previous visualization
            // svg.selectAll(".data-point2").remove(); // Clear previous visualization
        } 
        // points.forEach(point => {
        //     svg.append('circle')
        //         .attr('cx', xScale(point.x))
        //         .attr('cy', yScale(point.y))
        //         .attr('r', 1.5)
        //         .attr('fill', 'white')
        //         .attr('stroke', 'black');
        // });
    }, [points, enableCheckViz, axes]);

    const toggleCheckViz = () => {
        setEnableCheckViz(!enableCheckViz);
    };

    return (
        <div>
            <svg ref={svgRef} width={width} height={height}></svg>
            <button onClick={toggleCheckViz}>
                {enableCheckViz ? 'Disable CheckViz' : 'Enable CheckViz'}
            </button>
        </div>
    );
};

export default ProjectionView;
