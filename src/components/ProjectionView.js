import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { tnc } from '../tnc'; 
import { colormap } from '../colormap'; 
import { Delaunay } from 'd3-delaunay';


const ProjectionView = (props) => {


    const { data, axes, width, height, margin, enableCheckViz, setEnableCheckViz } = props;
    const svgRef = useRef(null);

    const points = data.map(d => {
        let dx = 0, dy = 0;
        axes.forEach((axis, index) => {
            dx += axis.x * d[index];
            dy += axis.y * d[index]; 
        });
        return { dx, dy };
    });

    useEffect(() => {
        const xScale = d3.scaleLinear()
                        .domain(d3.extent(points, d => d.dx))
                        .range([margin, width - margin]);
        const yScale = d3.scaleLinear()
                        .domain(d3.extent(points, d => d.dy))
                        .range([margin, height - margin]);

        const svg = d3.select(svgRef.current);
        svg.selectAll("circle").remove();

        svg.append("g" )
            .attr("transform", `translate(${margin}, ${margin})`)
            .selectAll("circle")
            .data(points)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.dx))
            .attr("cy", d => yScale(d.dy))
            .attr("r", 1.5)
            .style("fill", "white")
            .style("stroke", "black")

        if (enableCheckViz) {
            const projectedPoints2D = points.map(point => [point.dx, point.dy]);

            const { trust, conti } = tnc(data, projectedPoints2D);
            const colors = points.map((_, i) => {
                const color = d3.color(colormap(trust[i], conti[i]));
                return color;
            });

            const delaunay = Delaunay.from(points.map(d => [xScale(d.dx), yScale(d.dy)]));
            const voronoi = delaunay.voronoi([margin, margin, width-margin, height-margin]); 

            svg.append('g')
                .attr("transform", `translate(${margin}, ${margin})`)
                .selectAll("path")
                .data(points.map((_, i) => voronoi.renderCell(i)))
                .enter()
                .append("path")
                .attr("d", d => d)
                .attr("fill", (_, i) => colors[i])
                .attr("stroke", "none")
                .attr("class", "voronoi");
            
            svg.append("g" )
                .attr("transform", `translate(${margin}, ${margin})`)
                .selectAll("circle")
                .data(points)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(d.dx))
                .attr("cy", d => yScale(d.dy))
                .attr("r", 1.5)
                .style("fill", "white")
                .style("stroke", "black")
        }
        else {
            svg.selectAll(".voronoi").remove(); 
        } 

    }, [enableCheckViz, axes]);

    const toggleCheckViz = () => {
        setEnableCheckViz(!enableCheckViz);
    };

    return (
        <div>
            <svg ref={svgRef} width={width+margin} height={height+margin}></svg>
            <button style={{marginLeft: 2*margin}} onClick={toggleCheckViz}>
                {enableCheckViz ? 'Disable CheckViz' : 'Enable CheckViz'}
            </button>
        </div>
    );
};

export default ProjectionView;
