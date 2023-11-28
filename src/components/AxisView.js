import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import attributes from '../data/attr.json';

const AxisView = (props) => {
    const { axes, setAxes, enableCheckViz, setEnableCheckViz } = props;
    const svgRef = useRef(null);
    const radius = 150; 
    const center = { x: 225, y: 225 }; 

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const angleStep = (2 * Math.PI) / attributes.length;

        svg.append("circle")
            .attr("cx", center.x)
            .attr("cy", center.y)
            .attr("r", radius)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-dasharray", "5,5");

        attributes.forEach((attr, index) => {
            const angle = angleStep * index;
            const lineEnd = {
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle)
            };

            const labelRadius = radius + 40; 
            const labelPos = {
                x: center.x + labelRadius * Math.cos(angle),
                y: center.y + labelRadius * Math.sin(angle)
            };

            const line = svg.append("line")
                            .attr("x1", center.x)
                            .attr("y1", center.y)
                            .attr("x2", lineEnd.x)
                            .attr("y2", lineEnd.y)
                            .style("stroke", "black");

            const circle = svg.append("circle")
                            .attr("cx", lineEnd.x)
                            .attr("cy", lineEnd.y)
                            .attr("r", 5)
                            .style("fill", "black")
                            .style("cursor", "pointer")

            const text = svg.append("text")
                            .attr("x", labelPos.x)
                            .attr("y", labelPos.y)
                            .style("text-anchor", "middle")
                            .text(attr);

            const drag = d3.drag()
                            .on('start', () => {
                                line.style("stroke", "red");
                                circle.style("fill", "red")
                                text.style('fill', 'red');
                            })
                            .on('drag', (event) => {
                                setEnableCheckViz(false);

                                const dx = event.x - center.x;
                                const dy = event.y - center.y;
                                const newAngle = Math.atan2(dy, dx);
                    
                                const newLineEnd = {
                                    x: center.x + radius * Math.cos(newAngle),
                                    y: center.y + radius * Math.sin(newAngle)
                                };
                    
                                line.attr('x2', newLineEnd.x).attr('y2', newLineEnd.y);
                    
                                circle.attr('cx', newLineEnd.x).attr('cy', newLineEnd.y);
                    
                                const newLabelPos = {
                                    x: center.x + labelRadius * Math.cos(newAngle),
                                    y: center.y + labelRadius * Math.sin(newAngle)
                                };
                                text.attr('x', newLabelPos.x).attr('y', newLabelPos.y);
                                
                                const newAxes = axes.map((axis, i) => i === index ? { ...axis, x: Math.cos(newAngle), y: Math.sin(newAngle) } : axis);
                                setAxes(newAxes);
                                axes[index] = { x: Math.cos(newAngle), y: Math.sin(newAngle) }; 
                            })
                            .on('end', () => {
                                line.style("stroke", "black");
                                circle.style("fill", "black")
                                text.style('fill', 'black');
                            });
                    
            circle.call(drag);

            
        });
    }, []);

    return <svg ref={svgRef} width={radius * 3} height={radius * 3}></svg>;
};

export default AxisView;
