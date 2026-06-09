const Header = (props) => {
    return <h1>{props.course}</h1>
}

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Content = ({ parts }) => (
  <div>
    {parts.map(part => 
      <Part key={part.id} part={part} />
    )}
  </div>
)

const Total = (props) => (
    <p>
    <strong>Total of {props.total} exercises</strong>
    </p>
)


const Course = ({course}) => {
    const totalExercises = course.parts.reduce(
    (sum, part) => sum + part.exercises,
    0
    );
    return (
        <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total total={totalExercises} />
        </div>
    )
}

export default Course