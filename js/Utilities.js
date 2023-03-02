function DoBoundingBoxesCollide(m_BoundingBox1, m_BoundingBox2)
{
    if (m_BoundingBox1.intersectsBox(m_BoundingBox2) || m_BoundingBox1.containsBox(m_BoundingBox2)) {
        return true;
    }
    return false;
}