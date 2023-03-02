function handle_bricks_collision(m_SceneThreejs, m_Ball, a_BrickObjects)
{
    let m_BoundingSphere = m_Ball.get_bounding_sphere();
    let m_SphereBoundingBox = m_Ball.get_bounding_box();

    // Check each brick for collision with ball
    for (let index = 0; index < a_BrickObjects.length; index++) 
    {
        let m_BrickBoundingBox = a_BrickObjects[index].get_bounding_box();
        if (does_boundingsphere_collide_with_boundingbox(m_BoundingSphere, m_SphereBoundingBox, m_BrickBoundingBox))
        {
            // Make ball bounce off the brick
            m_Ball.bounce_off_brick(a_BrickObjects[index].get_bounding_box());

            // Apply damage
            {
                a_BrickObjects[index].hit();
                // If brick is destroyed
                if (a_BrickObjects[index].get_health() == 0)
                {
                    // Destroys brick mesh
                    a_BrickObjects[index].destroy(m_SceneThreejs);
                    // Removes from array
                    a_BrickObjects.splice(index, 1);
                    // Return so that ball can only bounce off 1 brick per frame
                    return;
                }
            }
        }
    }
} 