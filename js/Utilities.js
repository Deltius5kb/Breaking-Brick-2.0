function do_boundingboxes_collide(m_BoundingBox1, m_BoundingBox2)
{
    if (m_BoundingBox1.intersectsBox(m_BoundingBox2) || m_BoundingBox1.containsBox(m_BoundingBox2)) {
        return true;
    }
    return false;
}

function does_boundingsphere_collide_with_boundingbox(m_BoundingSphere, m_BoundingBoxOfSphere, m_BoundingBox)
{
    if (m_BoundingSphere.intersectsBox(m_BoundingBox) || m_BoundingBoxOfSphere.containsBox(m_BoundingBox)) {
        return true;
    }
    return false;
}