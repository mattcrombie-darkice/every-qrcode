"""Generate the Dark Ice Systems Cube GLB and USDZ assets with Blender."""

from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "apps" / "web" / "public" / "models"


def material(name, color, metallic=0.0, roughness=0.35, emission=None):
    value = bpy.data.materials.new(name)
    value.diffuse_color = (*color, 1.0)
    value.use_nodes = True
    shader = value.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = (*color, 1.0)
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    if emission:
        shader.inputs["Emission Color"].default_value = (*emission, 1.0)
        shader.inputs["Emission Strength"].default_value = 2.2
    return value


def rounded_cube(name, location, scale, surface, bevel=0.08):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    modifier = obj.modifiers.new("Precision bevel", "BEVEL")
    modifier.width = bevel
    modifier.segments = 4
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj.data.materials.append(surface)
    return obj


bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

dark = material("Dark Ice navy", (0.015, 0.045, 0.065), metallic=0.48, roughness=0.24)
cyan = material("Signal cyan", (0.02, 0.58, 0.78), metallic=0.28, roughness=0.2, emission=(0.0, 0.32, 0.5))
lime = material("Signal lime", (0.53, 0.76, 0.12), metallic=0.18, roughness=0.25, emission=(0.2, 0.32, 0.02))
ice = material("Ice face", (0.78, 0.88, 0.92), metallic=0.58, roughness=0.18)
graphite = material("Graphite base", (0.025, 0.075, 0.1), metallic=0.7, roughness=0.28)

rounded_cube("Systems Cube Core", (0, 0, 0.25), (1.0, 1.0, 1.0), dark, 0.16)
rounded_cube("Architecture Face", (0, 0, 1.3), (0.84, 0.84, 0.055), cyan, 0.055)
rounded_cube("Automation Face", (-1.055, 0, 0.25), (0.055, 0.84, 0.84), lime, 0.055)
rounded_cube("Delivery Face", (0, -1.055, 0.25), (0.84, 0.055, 0.84), ice, 0.055)
rounded_cube("Signal Platform", (0, 0, -1.0), (1.62, 1.62, 0.08), graphite, 0.08)

bpy.ops.mesh.primitive_torus_add(major_radius=1.55, minor_radius=0.025, location=(0, 0, 0.15), rotation=(0.92, 0.22, 0.18), major_segments=96, minor_segments=8)
orbit = bpy.context.active_object
orbit.name = "Live Signal Orbit"
orbit.data.materials.append(cyan)

for index, position in enumerate(((1.28, 0.38, 1.16), (-0.78, 1.15, -0.15), (0.42, -1.4, 0.08))):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=0.09, location=position)
    node = bpy.context.active_object
    node.name = f"Signal Node {index + 1}"
    node.data.materials.append(lime if index == 1 else cyan)

for obj in bpy.context.scene.objects:
    obj.select_set(obj.type == "MESH")

mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
center = sum((obj.location for obj in mesh_objects), Vector()) / max(1, len(mesh_objects))
for obj in mesh_objects:
    obj.location -= Vector((center.x, center.y, 0.0))

bpy.context.scene.world.color = (0.005, 0.012, 0.018)
OUTPUT.mkdir(parents=True, exist_ok=True)

bpy.ops.export_scene.gltf(
    filepath=str(OUTPUT / "dark-ice-systems-cube.glb"),
    export_format="GLB",
    export_apply=True,
    export_cameras=False,
    export_lights=False,
)

try:
    bpy.ops.wm.usd_export(
        filepath=str(OUTPUT / "dark-ice-systems-cube.usdz"),
        export_animation=False,
        export_materials=True,
        selected_objects_only=False,
    )
except Exception as error:
    print(f"USDZ export unavailable: {error}")

print(f"Generated Systems Cube assets in {OUTPUT}")
