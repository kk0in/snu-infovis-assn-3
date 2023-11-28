import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import attributes from '../data/attr.json'; // Assuming attributes are loaded from a local JSON file

const AxisView = (props) => {
    const { axes, setAxes, enableCheckViz, setEnableCheckViz } = props;
    const svgRef = useRef(null);
    const radius = 150; 
    const center = { x: 225, y: 225 }; 

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const angleStep = (2 * Math.PI) / attributes.length;

        // Draw the large circle
        svg.append("circle")
            .attr("cx", center.x)
            .attr("cy", center.y)
            .attr("r", radius)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-dasharray", "5,5");

        // Draw each axis
        attributes.forEach((attr, index) => {
            const angle = angleStep * index;
            const lineEnd = {
                x: center.x + radius * Math.cos(angle),
                y: center.y + radius * Math.sin(angle)
            };

            // const direction = {
            //     x: Math.cos(angle),
            //     y: Math.sin(angle)
            // };
            // setAxes(direction);
            
            // console.log(axes);

            const labelRadius = radius + 40; 
            const labelPos = {
                x: center.x + labelRadius * Math.cos(angle),
                y: center.y + labelRadius * Math.sin(angle)
            };

            // Axis Line
            const line = svg.append("line")
                            .attr("x1", center.x)
                            .attr("y1", center.y)
                            .attr("x2", lineEnd.x)
                            .attr("y2", lineEnd.y)
                            .style("stroke", "black");

            // Draggable Circle
            const circle = svg.append("circle")
                            .attr("cx", lineEnd.x)
                            .attr("cy", lineEnd.y)
                            .attr("r", 5)
                            .style("fill", "black")
                            .style("cursor", "pointer")

            // Axis Label
            const text = svg.append("text")
                            .attr("x", labelPos.x)
                            .attr("y", labelPos.y)
                            .style("text-anchor", "middle")
                            .text(attr);

            const drag = d3.drag()
                            .on('start', () => {
                                // Highlight the elements by changing the color to red
                                line.style("stroke", "red");
                                circle.style("fill", "red")
                                text.style('fill', 'red');
                            })
                            .on('drag', (event) => {
                                // Calculate the new angle based on the mouse position

                                setEnableCheckViz(false);

                                const dx = event.x - center.x;
                                const dy = event.y - center.y;
                                const newAngle = Math.atan2(dy, dx);
                    
                                // Calculate the new position of the line end
                                const newLineEnd = {
                                    x: center.x + radius * Math.cos(newAngle),
                                    y: center.y + radius * Math.sin(newAngle)
                                };

                    
                                // Update the line's end to the new position
                                line.attr('x2', newLineEnd.x).attr('y2', newLineEnd.y);
                    
                                // Update the circle's position to the new position
                                circle.attr('cx', newLineEnd.x).attr('cy', newLineEnd.y);
                    
                                // Update the text's position as well, similar to labelPos calculation
                                const newLabelPos = {
                                    x: center.x + labelRadius * Math.cos(newAngle),
                                    y: center.y + labelRadius * Math.sin(newAngle)
                                };
                                text.attr('x', newLabelPos.x).attr('y', newLabelPos.y);
                                
                                // You would need to implement the mechanism to update the Projection View using the new axis vector
                                // Update the angle in the axes array
                                const newAxes = axes.map((axis, i) => i === index ? { ...axis, x: Math.cos(newAngle), y: Math.sin(newAngle) } : axis);
                                setAxes(newAxes);
                            })
                            .on('end', () => {
                                // Remove the highlight by changing the color back
                                line.style("stroke", "black");
                                circle.style("fill", "black")
                                text.style('fill', 'black');
                            });
                    
            // Apply the drag behavior to the circle
            circle.call(drag);

            
        });
    }, []);

    return <svg ref={svgRef} width={radius * 3} height={radius * 3}></svg>;
};

export default AxisView;
