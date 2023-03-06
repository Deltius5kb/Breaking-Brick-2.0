//Powerups planning
/*
positive and negative powerups
make them smaller spheres
spheres fall down in straight line
spehers have powerup attribute
*/

const i_POWERUP_RADIUS = 10;

class Powerup
{
    #m_Sphere;
    #vec3_Velocity;
    constructor(m_SceneThreejs, vec3_Location, b_Positive = true)
    {
        this.#vec3_Velocity = new THREE.Vector3(0, -0.3, 0);
        // Make sphere geometry
        {
            let m_SphereGeometry = new THREE.SphereGeometry(10)
            let m_Color = d_Colours["Red"];
            if (b_Positive)
            {
                m_Color = d_Colours["Green"];
            }
            let m_Material = new THREE.MeshStandardMaterial(m_Color);
            this.#m_Sphere = new THREE.Mesh(m_SphereGeometry, m_Material);
            m_SceneThreejs.add(this.#m_Sphere);

            this.#m_Sphere.position.set(
                vec3_Location.x,
                vec3_Location.y,
                vec3_Location.z
            );
        }
    }

    update(f_DeltaTime)
    {
        this.#m_Sphere.position.set(
            this.#m_Sphere.position.x + this.#vec3_Velocity.x * f_DeltaTime,
            this.#m_Sphere.position.y + this.#vec3_Velocity.y * f_DeltaTime,
            this.#m_Sphere.position.z + this.#vec3_Velocity.z * f_DeltaTime
        );
    }
}