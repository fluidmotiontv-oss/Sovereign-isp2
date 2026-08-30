import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { MeshNode } from '../types';

interface MeshHeatmapOverlayProps {
  nodes: MeshNode[];
}

export const MeshHeatmapOverlay: React.FC<MeshHeatmapOverlayProps> = ({ nodes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Convert percentage coordinates to pixel coordinates
    const mappedNodes = nodes.map(n => ({
      x: (n.coordinates.x / 100) * width,
      y: (n.coordinates.y / 100) * height,
      bandwidth: n.bandwidthMbps,
    }));

    // Compute maximum bandwidth to normalize weights
    const maxBandwidth = d3.max(mappedNodes, d => d.bandwidth) || 1;

    // Generate contour density
    const density = d3.contourDensity<{x: number, y: number, bandwidth: number}>()
      .x(d => d.x)
      .y(d => d.y)
      .weight(d => d.bandwidth / maxBandwidth) // Scale weight for better visualization
      .size([width, height])
      .bandwidth(45) // Density smoothing radius
      .thresholds(12) // Density levels
      (mappedNodes);

    const maxDensity = d3.max(density, d => d.value) || 1;

    // Cyberpunk mapping: cyan to emerald
    const colorCustom = d3.scaleLinear<string>()
      .domain([0, maxDensity * 0.3, maxDensity])
      .range(["rgba(6, 182, 212, 0.0)", "rgba(16, 185, 129, 0.2)", "rgba(16, 185, 129, 0.6)"]);

    svg.append("g")
      .selectAll("path")
      .data(density)
      .enter().append("path")
      .attr("d", d3.geoPath())
      .attr("fill", d => colorCustom(d.value))
      .attr("stroke", d => colorCustom(d.value))
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.8)
      .style("mix-blend-mode", "screen");

  }, [nodes, dimensions]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
};
